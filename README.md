# personal_web

Static homepage portal for `jesse.<tld>`. Vanilla HTML/CSS/JS, no build step, no framework.

Sibling apps it points at:

- `Jesse-vdR/Training-app` — calisthenics + running PWA
- `Jesse-vdR/journal_app` — text + voice journal PWA

Tracks issue [Jesse-vdR/Jesse#9](https://github.com/Jesse-vdR/Jesse/issues/9) (Phase 4).

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

## Apex swap

When the apex domain is provisioned and `*.jesse.<tld>` resolves, swap the two
hardcoded `https://jesse-vdr.github.io/...` URLs in `index.html` to
`https://training.<apex>/` and `https://journal.<apex>/`. Comments mark both lines.
