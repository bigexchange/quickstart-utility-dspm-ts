#!/usr/bin/env bash
. ./setenv.sh

# set image build and publish option defaults
BUILD_FLAG="yes";
PUBLISH_FLAG="no";

# check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "This script uses docker, and it isn't running - please start docker and try again!"
  exit 1
fi

# parse the command line options for user input
while getopts b:p: flag
do
    case "${flag}" in
        b) BUILD_FLAG=${OPTARG};;
        p) PUBLISH_FLAG=${OPTARG};;
    esac
done

# check if docker image should be built
if [[ $BUILD_FLAG == "yes" ]]; then
    # Instructions: any changes to Manifest file require rebuild and reregistration of container/image
    # Recommend to delete the old image
    for dir in ../services/*/; do
        dirName=(${dir//\// })
        tag=${dirName[${#dirName[@]}-1]}
        (cd $dir && npm i && npm run build && docker build --no-cache --tag tag ./)
    done
    
fi

# check if release should be created for publishing
if [[ $PUBLISH_FLAG == "yes" ]]; then
    echo "Starting the publish operation for $IMAGE_NAME";

    # make temp output directory
    echo "...creating the temp output directory"
    mkdir -p ./temp/output/release;
    # copy scripts over
    echo "...copying over the release files"
    cp ./setenv.sh ./temp/output/release;
    cp ./start-app.sh ./temp/output/release;
    cp ./stop-app.sh ./temp/output/release;
    cp ./app-compose.yaml ./temp/output/release;
    cp ./app-compose.networks.yaml ./temp/output/release;
    # save docker image to tar.gz file
    echo "...saving the docker image '$IMAGE_NAME' (this might take a few minutes)"
    docker save $IMAGE_NAME | gzip > ./temp/output/release/image.tar.gz
    # zip up the release folder
    echo "...zipping up the build output (this too might take a few minutes)"
    zip -r ./temp/output/release.zip ./temp/output/release
    # clean up the release folder
    echo "...removing the release files"
    rm -r ./temp/output/release

    echo "Publish operation completed!"
fi