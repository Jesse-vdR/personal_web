// shell.test.mjs — Node ESM test for shell.js helpers.
// Run with:  node shell/shell.test.mjs
// Exits 0 on success, non-zero on first failed assertion.

import assert from "node:assert/strict";
import { HEAT, heatColor, Shell } from "./shell.js";

// HEAT[] is exactly 12 hex colors.
assert.equal(HEAT.length, 12, "HEAT must have 12 stops");
HEAT.forEach((c, i) => {
  assert.match(c, /^#[0-9a-f]{6}$/i, `HEAT[${i}] not a hex color: ${c}`);
});
assert.equal(HEAT[0], "#60a5fa", "HEAT[0] must be sky blue");
assert.equal(HEAT[11], "#dc2626", "HEAT[11] must be red");

// Shell exports HEAT + heatColor.
assert.equal(Shell.HEAT, HEAT, "Shell.HEAT is the same array");
assert.equal(Shell.heatColor, heatColor, "Shell.heatColor is the same function");

// heatColor(done, total) returns the color of the NEXT cell to light.
// For a 12-rep set, done maps directly to HEAT index.
assert.equal(heatColor(0, 12),  HEAT[0],  "0/12 → HEAT[0]");
assert.equal(heatColor(8, 12),  HEAT[8],  "8/12 → HEAT[8]");
assert.equal(heatColor(11, 12), HEAT[11], "11/12 → HEAT[11]");
assert.equal(heatColor(12, 12), HEAT[11], "saturated state stays at HEAT[11]");

// For an 8-rep set, the 12-stop palette is sampled proportionally.
assert.equal(heatColor(0, 8), HEAT[0],  "0/8 → HEAT[0]");
assert.equal(heatColor(7, 8), HEAT[11], "7/8 → HEAT[11] (last)");
// Mid-set falls in the warm middle, not at endpoints.
const mid = heatColor(4, 8);
assert.notEqual(mid, HEAT[0],  "4/8 must not be the first color");
assert.notEqual(mid, HEAT[11], "4/8 must not be the last color");

// Edge cases: total=0 falls back to first color.
assert.equal(heatColor(0, 0), HEAT[0], "total=0 → HEAT[0]");
// Negative done clamps to first color.
assert.equal(heatColor(-3, 12), HEAT[0], "negative done → HEAT[0]");

console.log("OK: all shell.js helper tests passed");
