# Quickstart Policies Utility App - TypeScript

A BigID Utility App project template written in [TypeScript](https://www.typescriptlang.org/), meant to serve as a starting point for leveraging data from the [BigID Policies API](https://www.docs.bigid.com/bigid/reference/head_policies-helpful-hints-page).

The sections below describe how to debug the solution, how to build it to run in a Docker container (both locally and remote), how to load the app into an instance of BigID, and what actions are provided in this starter app.

Once cloned, this solution can be used as the starting point for your own BigID Utility App by editing the existing actions or adding new ones. Or it can simply be a point of reference or example for integrating with the [BigID Policies API](https://www.docs.bigid.com/bigid/reference/head_policies-helpful-hints-page).

- [How to debug](##How-to-debug)
- [How to build for running in Docker](##How-to-build-for-running-in-Docker)
  - [Building for local Docker instance](###Building-for-local-Docker-instance)
  - [Building and packaging for remote Docker instance](###Building-and-packaging-for-remote-Docker-instance)
- [How to deploy to a BigID instance](##How-to-deploy-to-a-BigID-instance)
  - [Deploy the app](###Deploy-the-app)
  - [Load the app into BigID](###Load-the-app-into-BigID)
- [Actions provided in this app](##Actions-provided-in-this-app)

## How to debug

Development environment assumptions:

- Visual Studio Code
- Docker Desktop

Once the repo has been cloned to your local machine, navigate to the following project directory:

```bash
cd /<your local git folder>/quickstart-utility-policies-ts/services/quickstart-utility/src/main/app
```

- Install dependencies by running the following command

```bash
npm install
```

- Run the app locally with the following command. This will start up the app and have the server watch for any file changes so the app will reload as necessary while developing.

```bash
npm run start-watch
```

## How to build for running in Docker

- In your terminal, navigate to the deployment directory:

```bash
cd /quickstart-utility-policies-ts/deployment
```

- Edit the host and container ports, if desired, in `setenv.sh` file
  - The default values are `PORTS_HOST="8085"` and `PORTS_CONTAINER="8085"`

### Building for local Docker instance

- Build the docker image by executing

```bash
./build.sh
```

> NOTE: No command line args are required when building for local Docker instance

- This will build the image with a name and tag of **bigexchange/quickstart-utility-policies-ts:1.0.0** (which is configured in the `setenv.sh` file)
- Start up the docker container by executing

```bash
./start-app.sh
```

- Once up and running, the container can be stopped by executing

```bash
./stop-app.sh
```

### Building and packaging for remote Docker instance

- Build the docker image by executing

```bash
./build.sh -b yes -p yes
```

> NOTE: Command line args for build, `-b`, and publish, `-p`, are required when building for remote Docker instances. If an image has already been built locally, you may pass `-b no -p yes` on the command line, otherwise just pass "yes" for both, `bash -b yes -p yes`

- Running the command above
  - Builds the image with a name and tag of **bigexchange/quickstart-utility-policies-ts:1.0.0** (which is configured in the `setenv.sh` file)
  - Creates the following temp output folder: `/quickstart-utility-policies-ts/deployment/temp/output/release`
  - Copies all `.sh` files required for starting/stopping the container to the release folder
  - Saves the image to the release folder with the name `image.tar.gz`
  - Zips the release folder to `release.zip` which can then be copied/moved out to any server running Docker for hosting the app. The contents of the zip file should be as follows:

```text
  /release.zip
    app-compose.networks.yaml
    app-compose.yaml
    image.tar.gz
    setenv.sh
    start-app.sh
    stop-app.sh
```

- The release folder is then deleted

## How to deploy to a BigID instance

### Deploy the app

When loading an app to a BigID instance, the app's url must be accessible to the instance. The easiest way to accomplish this is to load the app's container on the same app server as the BigID instance by doing the following:

- Copy the `release.zip` file that was built in the [Building and packaging for remote Docker instance](###Building-and-packaging-for-remote-Docker-instance) over to the app server. Following is an example of doing so via sftp:

```bash
/usr/bin/sftp -i ~/.ssh/<your-certificate> bigid@<server-ip>
sftp> put release.zip
sftp> bye
```

- On the app server, unzip the `release.zip` file
- Navigate to the `/release` directory
- Execute the following to load the app's image and start the container:

```bash
./start-app.sh prod
```

### Load the app into BigID

- Enable the SHOW_CUSTOM_APPS feature flag
  - Administration > Services Configuration
  - Search variable name SHOW_CUSTOM_APPS, and set it to true.
- Add App
  - Navigate to **Applications Management > Add App**
  - In Application Base URL, type: `http://quickstart-utility-policies-ts:<port>`, and click 'Go'.
    - The `<port>` must match the `PORTS_HOST` value set for the app in the `setenv.sh` file

## Actions provided in this app

### 1. Get all Policies

Get a list of all Policies defined in the system.

**Params**

|Name | Type | Description|
|---|---|---|
|Enabled Policies|String|Only return Policies that are currently enabled. Valid values are 'True' or 'False'. Default is 'True'.|
|Violated Policies|String|Only return Policies that have been violated. Valid values are 'True' or 'False'. Default is 'False'.|
|ALL Polices|String|Return all Policies regardless of status or enabled. If set to 'True', the 'Enabled Policies' and 'Violated Polcies' parameters are ignored. Default is 'False'.|
|Output results for download|String|Enable/Disable output of results in JSON format for download from 'Activity log' page. Valid values are 'True' or 'False'. Default is 'False'.|

### 2. Get Policy Details

Get the details for a single Policy definition.

**Params**

|Name | Type | Description|
|---|---|---|
|Policy name|String|Name of the Policy definition.|
|Include object list|String|Include a list of objects that have been found to be in violation of this policy. Valid values are 'True' or 'False'. Default is 'False'.|
|Include task details|String|If the Policy has been violated, include the details of the Task created as a result of the violation. Valid values are 'True' or 'False'. Default is 'False'.|
|Output results for download|String|Enable/Disable output of results in JSON format for download from 'Activity log' page. Valid values are 'True' or 'False'. Default is 'False'.|

### 3. Upload sample file to BigID

This demonstrates an upload of a file to the BigID environment.

**Params**

_None_

### 4. Increment counter

This demonstrates a counter using the BigID App Framework to store and retrieve data to/from App Storage.

**Params**

_None_
