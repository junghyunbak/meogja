#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

BE_IMAGE_NAME=meogja-be

docker build --file "$SCRIPT_DIR/Dockerfile" --no-cache --tag ${BE_IMAGE_NAME} "$SCRIPT_DIR/../.."

docker rm --force ${BE_IMAGE_NAME}

docker image prune --force

docker run --detach --publish 3002:3002 --name ${BE_IMAGE_NAME} ${BE_IMAGE_NAME} 
