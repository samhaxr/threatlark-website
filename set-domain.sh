#!/usr/bin/env bash
# Usage: ./set-domain.sh www.yourdomain.com
# Replaces the www.example.com placeholder in every page, sitemap.xml, robots.txt and CNAME.
set -euo pipefail
if [ $# -ne 1 ]; then echo "usage: $0 <domain, e.g. www.threatlark.com>"; exit 1; fi
DOMAIN="$1"
cd "$(dirname "$0")"
# URLs (canonical, Open Graph, sitemap, robots)
grep -rl "https://www.example.com" --include='*.html' --include='*.xml' --include='*.txt' . | xargs sed -i "s#https://www.example.com#https://${DOMAIN}#g"
# Custom domain for the static host
printf '%s\n' "${DOMAIN}" > CNAME
echo "Domain set to ${DOMAIN}. Review with: git diff --stat"
