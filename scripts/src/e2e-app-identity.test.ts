import { describe, expect, it, vi } from "vitest";
import {
  failedProbes,
  formatIdentityFailure,
  probeRoutes,
  type RouteProbe,
  requiredRoutes,
} from "./e2e-app-identity";

// The guard's whole job is to fail when the port holds a different app. A bug
// that makes it pass silently restores the original defect, so the failure
// paths carry the weight here.

describe("probeRoutes", () => {
  it("reports the status of every route against the base URL", async () => {
    const fetchImpl = vi.fn(async (url: string) => ({ status: url.endsWith("/b/") ? 404 : 200 }));
    const probes = await probeRoutes("http://localhost:4351", ["/a/", "/b/"], fetchImpl);

    expect(probes).toEqual([
      { route: "/a/", status: 200 },
      { route: "/b/", status: 404 },
    ]);
    expect(fetchImpl).toHaveBeenCalledWith("http://localhost:4351/a/");
  });

  it("does not double the slash when the base URL has a trailing one", async () => {
    const fetchImpl = vi.fn(async () => ({ status: 200 }));
    await probeRoutes("http://localhost:4351/", ["/a/"], fetchImpl);
    expect(fetchImpl).toHaveBeenCalledWith("http://localhost:4351/a/");
  });

  it("turns a transport error into `unreachable` rather than throwing", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    });
    await expect(probeRoutes("http://localhost:4351", ["/"], fetchImpl)).resolves.toEqual([
      { route: "/", status: "unreachable" },
    ]);
  });
});

describe("failedProbes", () => {
  it("treats only 2xx as success", () => {
    const probes: RouteProbe[] = [
      { route: "/ok/", status: 200 },
      { route: "/created/", status: 204 },
      { route: "/moved/", status: 301 },
      { route: "/missing/", status: 404 },
      { route: "/down/", status: "unreachable" },
    ];
    expect(failedProbes(probes).map((p) => p.route)).toEqual(["/moved/", "/missing/", "/down/"]);
  });
});

describe("formatIdentityFailure", () => {
  it("returns null when every route answered", () => {
    const probes = requiredRoutes.map((route) => ({ route, status: 200 }) as RouteProbe);
    expect(formatIdentityFailure("http://localhost:4351", probes)).toBeNull();
  });

  it("names the wrong app when the server answers but the routes are missing", () => {
    // The 2026-09-08 incident: a sibling clone served `/` and 404'd the rest.
    const probes: RouteProbe[] = [
      { route: "/", status: 200 },
      { route: "/contact/", status: 404 },
      { route: "/showcase/", status: 404 },
    ];
    const message = formatIdentityFailure("http://localhost:4351", probes);

    expect(message).toContain("is not this application");
    expect(message).toContain("/contact/ → 404");
    expect(message).toContain("/showcase/ → 404");
    expect(message).not.toContain("/ → 200");
  });

  it("distinguishes nothing-listening from the wrong app", () => {
    const probes: RouteProbe[] = [
      { route: "/", status: "unreachable" },
      { route: "/contact/", status: "unreachable" },
    ];
    const message = formatIdentityFailure("http://localhost:4351", probes);

    expect(message).toContain("No server answered");
    expect(message).toContain("pnpm run build");
    expect(message).not.toContain("is not this application");
  });
});
