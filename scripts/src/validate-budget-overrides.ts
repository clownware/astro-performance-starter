#!/usr/bin/env node
/// <reference types="node" />
/**
 * Validate budget-overrides.json to ensure no expired overrides remain
 * Exit with code 1 if any override entry has an `expires` date earlier than today.
 */
import * as fs from "node:fs";
import * as path from "node:path";

const filePath = path.resolve(process.cwd(), "budget-overrides.json");
if (!fs.existsSync(filePath)) {
  console.error(`❌ budget-overrides.json not found at ${filePath}`);
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
  overrides: Array<{ metric: string; expires?: string }>;
};

const today = new Date().toISOString().split("T")[0];

const expired = (json.overrides || []).filter((o) => {
  if (!o.expires) {
    return false;
  }
  return o.expires < today;
});

if (expired.length) {
  console.error("❌ Found expired budget overrides:\n");
  for (const o of expired) {
    console.error(` • ${o.metric} (expired ${o.expires})`);
  }
  console.error("\nMove these records to `expired_overrides` to unblock CI.");
  process.exit(1);
}

console.log("✅ No expired budget overrides.");
