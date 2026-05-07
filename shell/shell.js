// shell.js — personal-hub shell · v1 (2026-05-07)
// Source of truth: Jesse-vdR/Jesse:docs/design-system.md
//
// Exports:
//   HEAT       — 12-color array (ice → fire), 0-indexed
//   heatColor  — (done, total) → next-cell color
//   Shell      — namespace: { HEAT, heatColor, mount }
//
// Mount lands in Task 6. This file currently exposes only the helpers.

export const HEAT = [
  "#60a5fa", "#729bef", "#8590e3", "#9985d6",
  "#ad7ac8", "#c170b8", "#d266a8", "#df5e92",
  "#e8567c", "#e54a64", "#df3a4d", "#dc2626",
];

/**
 * heatColor(done, total) → the heat color for the NEXT cell about to light.
 * Maps "done out of total" proportionally onto the 12-stop palette so an
 * 8-rep set, a 12-rep set, or a 30-second hold all use the same gradient.
 */
export function heatColor(done, total) {
  if (!Number.isFinite(total) || total <= 0) return HEAT[0];
  if (!Number.isFinite(done)) return HEAT[0];
  const next = Math.max(0, Math.min(done, total - 1));
  const denom = Math.max(total - 1, 1);
  const idx = Math.round(next * (HEAT.length - 1) / denom);
  return HEAT[Math.min(idx, HEAT.length - 1)];
}

export const Shell = {
  HEAT,
  heatColor,
  mount(_opts) {
    // Implemented in Task 6.
    throw new Error("Shell.mount: not implemented yet");
  },
};
