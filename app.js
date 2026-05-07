// app.js — apex-only logic. The shell handles auth; this file handles
// the profile page's content and the footer year.

const API = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://api.jesselab.space";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const profileEl = document.getElementById("profile");
if (profileEl) renderProfile();

async function renderProfile() {
  const loading = document.getElementById("profile-loading");
  let me;
  try {
    const res = await fetch(`${API}/v1/me`, { credentials: "include" });
    if (res.status === 401) {
      const next = encodeURIComponent(location.origin + "/profile");
      location.href = `${API}/v1/auth/google/login?next=${next}`;
      return;
    }
    if (!res.ok) throw new Error(`/v1/me: ${res.status}`);
    me = await res.json();
  } catch (err) {
    if (loading) loading.innerHTML = `<p>could not reach api (${err.message})</p>`;
    return;
  }
  document.getElementById("p-name").textContent = me.display_name || "—";
  document.getElementById("p-email").textContent = me.email;
  if (loading) loading.hidden = true;
  profileEl.hidden = false;
  document.getElementById("byok").hidden = false;
  document.getElementById("actions").hidden = false;
}
