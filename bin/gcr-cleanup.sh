#!/bin/sh

# Inspired by
# https://gist.github.com/ahmetb/7ce6d741bd5baa194a3fac6b1fec8bb7

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 <image> <threshold>"
  exit 1
fi

readonly IMAGE="$1"
readonly THRESHOLD="$2"

IMAGES=$(
  gcloud container images list-tags ${IMAGE} \
  --limit=10 \
  --sort-by=~timestamp \
  --format='get(digest)' \
)

DIGESTS=$(echo "$IMAGES" | sed -e "1,${THRESHOLD}d")

count=0
for digest in $DIGESTS; do
  (
    set -x
    gcloud container images delete -q --force-delete-tags "${IMAGE}@${digest}"
  )
  count=$((count + 1))
done

echo "Deleted ${count} images in ${IMAGE}"
exit 0
