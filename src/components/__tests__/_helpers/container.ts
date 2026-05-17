// Shared Astro Container helper for component microtests (ADR-040).
//
// experimental_AstroContainer is imported in EXACTLY ONE place — this file —
// so that an upstream API change requires editing one helper rather than
// every atom/molecule test file. Adding new tests should import { render }
// from this module instead of touching astro/container directly.

import {
  experimental_AstroContainer as AstroContainer,
  type ContainerRenderOptions,
} from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

let containerPromise: Promise<AstroContainer> | null = null;

/**
 * Returns a memoised AstroContainer for the current Node process.
 *
 * AstroContainer is stateless between renders — caching avoids the per-test
 * `create()` cost (single-digit milliseconds, but multiplied across 100+
 * component tests it adds up).
 *
 * Exposed for the rare case where a test needs container.renderToResponse()
 * or another method beyond render(). Prefer render() for plain HTML assertions.
 */
export const getContainer = (): Promise<AstroContainer> => {
  if (!containerPromise) {
    containerPromise = AstroContainer.create();
  }
  return containerPromise;
};

/**
 * Renders an .astro component to an HTML string for assertion.
 *
 * Slots usage:
 *   - Default slot: `render(Component, props, { default: "text" })`
 *   - Named slots (e.g. Card with header/footer):
 *     `render(Card, props, { default: "body", header: "<h2>Title</h2>" })`
 *
 * Pass-through options (params, locals, request, etc.) are accepted via the
 * `extra` parameter for the rare case a test needs them; most tests will
 * only use `props` and `slots`.
 *
 * @param Component  The .astro module's default export (typed loosely; Astro's
 *                   compiled module type is internal)
 * @param props      Props passed to the component
 * @param slots      Named slots; use `default` for the unnamed slot
 * @param extra      Additional ContainerRenderOptions (params, locals, etc.)
 */
export const render = async (
  Component: AstroComponentFactory,
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
  extra: Omit<ContainerRenderOptions, "props" | "slots"> = {},
): Promise<string> => {
  const container = await getContainer();
  return container.renderToString(Component, {
    props,
    slots,
    ...extra,
  });
};

/**
 * Resets the cached container — only needed if a test deliberately mutates
 * container state (rare). Call from a test's afterAll() if used.
 */
export const resetContainer = (): void => {
  containerPromise = null;
};
