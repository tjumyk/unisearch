#!/usr/bin/env bash
set -e

chrome="google-chrome"
dist_dir=".dist"

if [ -d "$dist_dir" ]; then
  rm -r "$dist_dir"
fi

mkdir "$dist_dir"

for f in $(ls); do
  if [ -f "$f" ]; then
    ext="${f##*.}"
    if [ "$ext" == "iml" ] || [ "$ext" == "sh" ]; then
      echo "Skipping $f"
      continue
    fi
  fi
  cp -r "$f" "$dist_dir"
done

cd "$dist_dir"
zip -r ../unisearch.zip .
