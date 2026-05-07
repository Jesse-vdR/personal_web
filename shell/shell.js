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

  /**
   * Mount the shared topbar and wire auth.
   *
   * @param {{
   *   mode?: "apex" | "subapp",
   *   apiBase: string,            // e.g., "https://api.jesselab.space"
   *   homeUrl?: string,           // brand-link target (default: "https://jesselab.space/")
   *   mountSelector?: string,     // default: "#jesse-topbar"
   * }} opts
   */
  mount(opts = {}) {
    const {
      mode = "subapp",
      apiBase,
      homeUrl = "https://jesselab.space/",
      mountSelector = "#jesse-topbar",
    } = opts;
    if (!apiBase) throw new Error("Shell.mount: apiBase is required");

    const target = document.querySelector(mountSelector);
    const html = topbarHTML(mode, homeUrl);
    if (target) {
      target.outerHTML = html;
    } else {
      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);
    }

    wireAuth(apiBase, mode, homeUrl);
  },
};

function topbarHTML(mode, homeUrl) {
  if (mode === "apex") {
    return `
<header class="shell-topbar shell-topbar--apex">
  <div class="shell-topbar__inner">
    <span class="shell-topbar__brand-text">JESSE</span>
    <div class="shell-topbar__user" id="shell-topbar-user"></div>
  </div>
</header>`.trim();
  }
  return `
<header class="shell-topbar">
  <div class="shell-topbar__inner">
    <a class="shell-topbar__brand" href="${escapeAttr(homeUrl)}">
      <span class="shell-topbar__arrow" aria-hidden="true">←</span>
      <span class="shell-topbar__brand-text">jesselab</span>
    </a>
    <div class="shell-topbar__user" id="shell-topbar-user"></div>
  </div>
</header>`.trim();
}

async function wireAuth(apiBase, mode, homeUrl) {
  const userEl = document.getElementById("shell-topbar-user");
  if (!userEl) return;
  let me = null;
  try {
    const res = await fetch(`${apiBase}/v1/me`, { credentials: "include" });
    if (res.status === 401) { renderSignIn(userEl, apiBase); return; }
    if (!res.ok) return; // silent — leave widget empty
    me = await res.json();
  } catch {
    return; // offline / DNS / CORS — widget stays empty, app keeps working
  }
  renderSignedIn(userEl, me, apiBase, homeUrl);
}

function renderSignIn(userEl, apiBase) {
  const next = encodeURIComponent(location.origin + location.pathname);
  userEl.innerHTML = `
    <a class="shell-btn-link" href="${escapeAttr(apiBase)}/v1/auth/google/login?next=${next}">SIGN IN</a>
  `.trim();
}

function renderSignedIn(userEl, me, apiBase, homeUrl) {
  const display = (me.display_name || me.email || "")
    .split(" ")[0]
    .toUpperCase()
    .slice(0, 12);
  const avatarHTML = me.avatar_url
    ? `<img class="shell-topbar__avatar" src="${escapeAttr(me.avatar_url)}" alt="">`
    : `<span class="shell-topbar__avatar shell-topbar__avatar--gradient"></span>`;
  userEl.innerHTML = `
    <span class="shell-topbar__user-name">${escapeHTML(display)}</span>
    <button class="shell-btn-link" id="shell-topbar-signout" type="button">SIGN OUT</button>
    ${avatarHTML}
  `.trim();
  document.getElementById("shell-topbar-signout").onclick = async () => {
    try {
      await fetch(`${apiBase}/v1/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
    location.href = homeUrl;
  };
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(s) {
  return String(s).replace(/["<>&]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
