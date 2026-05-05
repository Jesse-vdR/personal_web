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

## Deploy (Phase 4.2)

Once `jesse-prod` has nginx + the wildcard cert (Phase 1.3 / 0.4):

```bash
rsync -av --delete --exclude .git ./ deploy@jesse-prod:/srv/web/home/
```

Served at `https://jesse.<tld>/` via the nginx server block from Phase 4.4.

## Apex swap

When the apex domain is provisioned and `*.jesse.<tld>` resolves, swap the two
hardcoded `https://jesse-vdr.github.io/...` URLs in `index.html` to
`https://training.<apex>/` and `https://journal.<apex>/`. Comments mark both lines.
