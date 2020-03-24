# Installing Esper API

## Prerequisites

The Esper API wrapper is written in Node.js, in order to use it you will need to have a working installation of node on your machine along with a suitable package manager, `npm` or `yarn` are suitable.

You can download Node.js [here](https://nodejs.org/en/) - we recommend you install the LTS version.

To make sure Node.js is correctly installed, issue the command 
```console
$ node -v
```
This will tell you what verison of Node.js is installed on your machine.

`npm` is distributed with Node.js so should be available to you once you've installed node.

This can be verified with:
```console 
$ npm -v
``` 

If you wish to use `yarn` you can download it [here](https://legacy.yarnpkg.com/en/)


 

## Installation
Before you start using the Esper API, you need to install it on the system you are using. You can start from scratch building the scripts you want by creating a new project or you can clone the Esper SDK to utilise a number of worked examples to get you started.

## Starting a new project from scratch
If you want to start from scratch, create yourself a new npm project with the command 

if using NPM:
```console
$ npm init
```

if using Yarn:
```console
$ yarn init
```
Both of these options will guide you through creating your project.

Once your project is created, install the Esper API with the following command:

```console
$ npm install esper-api
``` 
or
```console
$ yarn install esper-api
```

You can issue the same install command to add `esper-api` to an existing project.




## Cloning the Esper SDK

The Esper SDK repository can be found on [Github](https://github.com/esperhq/esper-sdk).

To clone the SDK, issue the following command in a directory of your choosing;

```console 
$ git clone https://github.com/esperhq/esper-sdk 
``` 
Once this has cloned, enter the new repository's directory
```console
$ cd ./esper-sdk
```
This will clone the contents of the repository, now you need to install the project dependencies by issuing the install command
```console
$ npm install esper-api
``` 
or
```console
$ yarn install esper-api
```
