#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

FE_IMAGE_NAME=meogja-fe

docker build --file "$SCRIPT_DIR/Dockerfile" --tag ${FE_IMAGE_NAME} "$SCRIPT_DIR/../.."

docker rm --force ${FE_IMAGE_NAME}

docker image prune --force

docker run --detach --publish 4173:4173 --name ${FE_IMAGE_NAME} ${FE_IMAGE_NAME}
