# personal_web

Static homepage portal for `jesse.<tld>`. Vanilla HTML/CSS/JS, no build step, no framework.

Sibling apps it points at:

- `Jesse-vdR/Training-app` — calisthenics + running PWA
- `Jesse-vdR/journal_app` — text + voice journal PWA

Tracks issue [Jesse-vdR/Jesse#9](https://github.com/Jesse-vdR/Jesse/issues/9) (Phase 4). Sign-in surfaces (Sign in with Google → `api.jesselab.space/v1/auth/google/login`, signed-in name/email, sign-out) and the `/projects` stub were added in [Jesse#25](https://github.com/Jesse-vdR/Jesse/issues/25).

## Local dev

```bash
python -m http.server 8001
# open http://localhost:8001
```

That's it. No tooling.

## Deploy

`git push origin main` → GitHub Actions → SSH → `scripts/deploy.sh` on `jesse-prod`. Live: https://jesselab.space/.

Layout on the box:

- `/srv/web/home/repo/` — full git tree (rsync target)
- `/srv/web/home/site/` — what nginx serves (only public assets — html/css/js/svg/png/jpg/ico/webmanifest)
- `nginx/jesselab.space.conf` → `/etc/nginx/sites-available/jesselab.space` (apex-only block)

The wildcard `*.jesselab.space` catch-all is owned separately (Phase 1.3) — this block matches the apex via more-specific `server_name jesselab.space` so it wins for the apex.

## GH Actions secrets

| Name | Value |
|---|---|
| `SSH_PRIVATE_KEY` | private half of the deploy key (separate from personal_api's) |
| `SSH_HOST` | `84.235.161.26` |
| `SSH_USER` | `deploy` |

## Auth

`app.js` calls `https://api.jesselab.space/v1/me` with `credentials: 'include'`. The session cookie is shared via the `.jesselab.space` cookie domain so signing in on the API drops a cookie this site reads. Sign-in button links to `/v1/auth/google/login?next=https://jesselab.space/`. Locally: API at `:8000`, this at `:8001`; `app.js` switches API base on `localhost` hostname.

For the redirect to work in prod the API needs `https://jesselab.space` in `ALLOWED_REDIRECT_ORIGINS` and `DEFAULT_POST_LOGIN_URL=https://jesselab.space/` (one-time `/etc/jesse/api.env` edit on `jesse-prod`, separate from this repo).
