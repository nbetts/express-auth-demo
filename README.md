# Express Auth Demo

A demonstration of simple authorization code flow using Express.js.

## Table of contents

- [Express Auth Demo](#express-auth-demo)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Getting started](#getting-started)
  - [Project structure](#project-structure)
  - [Testing](#testing)
  - [Debugging](#debugging)

## Overview

This project is a demonstration of [authorization code flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)
using [JWTs](https://jwt.io/introduction) with the Bearer schema.
It uses [Express.js](https://expressjs.com/) to orchestrate a web server, and an in-memory JavaScript database for ease of demonstration. The database holds session and user data.

Authorization includes registration, login, logout, and session refresh.
Password hashing, refresh token hashing, and refresh token rotation are also included.
The authorization and resource endpoints exist in the same server for simplicity, however a proper setup these would exist as separate services.

## Getting started

Install dependencies:

```bash
cd express-auth-demo
npm install
```

Start the dev server:

```bash
npm run dev
```

Alternatively, build the app and start the production server:

```bash
npm run build
npm run start
```

Then call any request in the [requests.http](requests.http) file.

## Project structure



## Testing

Tests are located in the [test](test) folder. To run all tests:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Debugging

To debug in VSCode, hover over the Debug option that appears next to the scripts in package.json and choose the `dev` script.
