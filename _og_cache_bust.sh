#!/usr/bin/env bash
set -euo pipefail
VERSION="2026020205"
find artikel berita -name '*.html' -type f -print0 | while IFS= read -r -d '' f; do
  sed -i -E "s#(content=\"[^\"]+\.(jpg|jpeg|png))\"(\s+property=\"og:image\")#\1?v=${VERSION}\"\3#Ig" "$f" || true
  sed -i -E "s#(property=\"og:image\"\s+content=\"[^\"]+\.(jpg|jpeg|png))\"#\1?v=${VERSION}\"#Ig" "$f" || true
  sed -i -E "s#(content=\"[^\"]+\.(jpg|jpeg|png))\"(\s+name=\"twitter:image\")#\1?v=${VERSION}\"\3#Ig" "$f" || true
  sed -i -E "s#(name=\"twitter:image\"\s+content=\"[^\"]+\.(jpg|jpeg|png))\"#\1?v=${VERSION}\"#Ig" "$f" || true
 done
