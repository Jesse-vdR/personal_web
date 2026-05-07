const API = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://api.jesselab.space";

document.getElementById("year").textContent = new Date().getFullYear();

const auth = document.getElementById("auth");
if (auth) renderAuth();

const profile = document.getElementById("profile");
if (profile) renderProfile();

async function fetchMe() {
  const res = await fetch(`${API}/v1/me`, { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`/v1/me: ${res.status}`);
  return res.json();
}

async function renderAuth() {
  let me;
  try { me = await fetchMe(); } catch { return; }
  if (me) {
    const label = me.display_name || me.email;
    auth.innerHTML = `<span>${label}</span><button id="logout">sign out</button>`;
    document.getElementById("logout").onclick = signOut;
  } else {
    const next = encodeURIComponent(location.origin + location.pathname);
    auth.innerHTML = `<a href="${API}/v1/auth/google/login?next=${next}">sign in with Google</a>`;
  }
}

async function renderProfile() {
  const loading = document.getElementById("profile-loading");
  let me;
  try {
    me = await fetchMe();
  } catch (err) {
    loading.innerHTML = `<p>could not reach api (${err.message})</p>`;
    return;
  }
  if (!me) {
    const next = encodeURIComponent(location.origin + "/profile");
    location.href = `${API}/v1/auth/google/login?next=${next}`;
    return;
  }
  document.getElementById("p-name").textContent = me.display_name || "—";
  document.getElementById("p-email").textContent = me.email;
  loading.hidden = true;
  profile.hidden = false;
  document.getElementById("byok").hidden = false;
  document.getElementById("actions").hidden = false;
  document.getElementById("signout-page").onclick = signOut;
}

async function signOut() {
  await fetch(`${API}/v1/auth/logout`, { method: "POST", credentials: "include" });
  location.href = "/";
}
