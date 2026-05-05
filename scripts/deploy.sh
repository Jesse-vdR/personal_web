#!/usr/bin/env bash
# Runs on jesse-prod as the `deploy` user. Invoked over SSH by GitHub Actions
# after the runner has rsync'd the working tree to /srv/web/home/repo/.

set -euo pipefail

REPO=/srv/web/home/repo
SITE=/srv/web/home/site

cd "$REPO"

# 1. Sync public assets to the served directory. Anything not listed here
#    (README, scripts, nginx, .git*) stays out of the webroot.
rsync -a --delete \
    --include='*.html' \
    --include='*.css' \
    --include='*.js' \
    --include='*.svg' \
    --include='*.png' \
    --include='*.jpg' \
    --include='*.ico' \
    --include='*.webmanifest' \
    --include='*/' \
    --exclude='*' \
    "$REPO"/ "$SITE"/

# 2. Sync nginx site if it changed.
if ! sudo cmp -s nginx/jesselab.space.conf /etc/nginx/sites-available/jesselab.space; then
    sudo cp nginx/jesselab.space.conf /etc/nginx/sites-available/jesselab.space
    sudo ln -sf /etc/nginx/sites-available/jesselab.space /etc/nginx/sites-enabled/jesselab.space
    sudo nginx -t
    sudo systemctl reload nginx
fi

echo "deploy ok"
