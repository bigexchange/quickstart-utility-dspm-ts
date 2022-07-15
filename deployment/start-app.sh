#!/usr/bin/env bash
. ./setenv.sh

if [[ $1 == "prod" ]]; then
    if [[ "$(docker image inspect $IMAGE_NAME)" == "[]" ]]; then
        echo "App image not found, loading from file";
        # load the docker image from file
        docker load < image.tar.gz;
        echo "Image loaded successfully";
    fi

    # start up the container
    echo "Starting up container";
    docker compose -f app-compose.yaml -f app-compose.networks.yaml up -d;
    echo "$IMAGE_NAME started";
else
    echo "Starting up container locally";
    # start up the container
    docker compose -f app-compose.yaml up -d;
fi