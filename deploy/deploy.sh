#!/usr/bin/env bash
set -euo pipefail

APP_NAME=ai-dashboard
APP_DIR=/srv/apps/ai-dashboard
SRC_DIR=/home/jeremydavies/.openclaw/workspace/ai-token-league

echo "Building..."
cd "$SRC_DIR"
npm ci
npm run build

echo "Deploying static files..."
mkdir -p "$APP_DIR"
rm -rf "$APP_DIR/dist"
cp -r "$SRC_DIR/dist" "$APP_DIR/dist"

echo "Writing Caddy config..."
cat > /etc/caddy/conf.d/ai-dashboard.caddy <<'CONF'
ai-dashboard.r3x.io {
    root * /srv/apps/ai-dashboard/dist
    encode gzip
    try_files {path} /index.html
    file_server
}
CONF

caddy fmt --overwrite /etc/caddy/conf.d/ai-dashboard.caddy
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy

echo "Verifying..."
sleep 3
curl -sSL -o /dev/null -w "%{http_code}" --max-time 15 https://ai-dashboard.r3x.io

echo ""
echo "Deployed: https://ai-dashboard.r3x.io"
