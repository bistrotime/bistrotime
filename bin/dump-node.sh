#!/bin/sh

set -e

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

readonly NODE_VERSION="$1"

sed -E -i "s/NODE_VERSION: \".*\"$/NODE_VERSION: \"${NODE_VERSION}\"/g" .gitlab-ci.yml

for app in web api; do
  sed -E -i "s/FROM node:[0-9]+(\.[0-9]+)?/FROM node:${NODE_VERSION}/g" ${app}/Dockerfile
done
