# React web UI for Availability

[![Build Status](https://travis-ci.org/NSWSESMembers/availability-poc.svg?branch=master)](https://travis-ci.org/NSWSESMembers/availability-poc)
[![codecov](https://codecov.io/gh/NSWSESMembers/availability-poc/branch/master/graph/badge.svg)](https://codecov.io/gh/NSWSESMembers/availability-poc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a React web app that consumes the GraphQL API provided by the code in
`server/`. To get started you should probably read the [React website](https://reactjs.org).

It uses:

* The [GraphQL](http://graphql.org) protocol to talk to the server
* [Apollo Client](https://github.com/apollographql/apollo-client) to manage
  interactions with GraphQL
* [Redux](https://redux.js.org) to store state on the client
* [Material-UI](https://github.com/mui-org/material-ui) as the UI framework

## Install

To get started you'll need to install [NodeJS](https://nodejs.org/en/) with
your favourite package manager. Then install yarn:

```sh
npm install -g yarn
```

Now clone the repo and cd to `web`:

```sh
git clone ...
cd availability-poc/web
```

Install dependencies:

```sh
yarn
```

For a local dev server at localhost:5000, use:

```sh
yarn start
```

## Deploy

For an optimized build for production

```sh
yarn build:prod
```

## Contributing

Contributions of all kinds are welcomed but please attach screenshots to your
pull requests showing new functionality and/or an explanation of what you did
to verify your change doesn't cause a regression.

Please ensure commits that land on master are self-contained changes and easily revertable. This
can be achieved through non-fast-forward pushes to PR branches for PRs that contain multiple
commits or by using GitHub's squash and merge feature when you merge the PR.

CI/Travis must pass before a PR can be merged. We look for test coverage in all commits but do not
require that codecov passes.
