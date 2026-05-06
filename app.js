const API = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://api.jesselab.space";

document.getElementById("year").textContent = new Date().getFullYear();

const auth = document.getElementById("auth");
if (auth) renderAuth();

async function renderAuth() {
  const res = await fetch(`${API}/v1/me`, { credentials: "include" });
  if (res.ok) {
    const u = await res.json();
    const label = u.name || u.email;
    auth.innerHTML = `
      ${u.avatar_url ? `<img src="${u.avatar_url}" alt="">` : ""}
      <span>${label}</span>
      <button id="logout">sign out</button>`;
    document.getElementById("logout").onclick = signOut;
  } else {
    const next = encodeURIComponent(location.origin + "/");
    auth.innerHTML = `<a href="${API}/v1/auth/google/login?next=${next}">sign in with Google</a>`;
  }
}

async function signOut() {
  await fetch(`${API}/v1/auth/logout`, { method: "POST", credentials: "include" });
  location.reload();
}
