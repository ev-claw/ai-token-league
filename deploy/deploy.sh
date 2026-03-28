#!/bin/bash
set -e

APP=/srv/apps/ai-dashboard
REPO=git@github.com:ev-claw/ai-token-league.git

# Clone or pull the repository
if [ -d "$APP/.git" ]; then
  runuser -u deploy -- git -C "$APP" pull --ff-only
else
  runuser -u deploy -- sh -c "GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=accept-new' git clone $REPO $APP"
fi

# Create Caddy configuration
cat > /etc/caddy/conf.d/ai-dashboard.caddy <<"CONF"
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

echo "Deployed: https://ai-dashboard.r3x.io"
