# API Server for Availability

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/NSWSESMembers/availability-poc/branch/master/graph/badge.svg)](https://codecov.io/gh/NSWSESMembers/availability-poc)
[![Build Status](https://travis-ci.org/NSWSESMembers/availability-poc.svg?branch=master)](https://travis-ci.org/NSWSESMembers/availability-poc)

This is an API server for Availability. It generates some standard data at boot
but otherwise allows for normal signups, logins and data mutations persisting
to a [sqlite](https://www.sqlite.org) database using
[Sequelize](http://docs.sequelizejs.com).

We plan to switch to using a proper networked RDBMS soon.

The server was originally built using the wonderful
[Chatty](https://github.com/srtucker22/chatty)
[tutorial](https://medium.com/react-native-training/building-chatty-a-whatsapp-clone-with-react-native-and-apollo-part-1-setup-68a02f7e11).

It uses:
* [Express](https://expressjs.com) web framework
* [graphql-server-express](https://www.npmjs.com/package/graphql-server-express)
  which integrates a [GraphQL](http://graphql.org) server into Express
* [Sequelize](http://docs.sequelizejs.com) to expose an ORM over the DB

## Install

Clone the repo, cd into the directory and run the following to install the
dependencies:
```sh
yarn
```

**IMPORTANT**: Edit [`src/config.js`](./src/config.js) to set a secret if you're
even remotely interested in running this in production.


## Run server

```sh
yarn run start
```

This will automatically create a local sqlite database for development and
load the test-data. If you'd like to reset your DB at anytime you can run:
```sh
yarn setup-db
```

## Deploy

The server is deployed automatically to Heroku via Travis CI. Check the
[.travis.yml](../.travis.yml) for more detail.

You can play with the API
[here](http://ses-availability-api.herokuapp.com/graphiql).

If you'd like to deploy yourself you can build a bundle into `dist/` by
executing:
```sh
yarn build
```

You can then execute the production-ready server bundle on your local
machine using:
```sh
yarn serve
```

If you're deploying to heroku just ship the built `dist` directory - it
contains a `Procfile` that will start the server:
```sh
node main.js
```

You'll need to initialize the DB and load the test data the first time by
running the following from the console of a production dyno:
```sh
node scripts/setup_db.js
```

Once you have a server running you can access GraphQL at
[`/graphql`](http://localhost:8080/graphql) or you can
play with the API explorer at [`/graphiql`](http://localhost:8080/graphiql).

## DB schema changes/Migrations

We don't currently have a DB migration framework. Pull requests are welcome to
add one. In the meantime if you modify `models.js` make sure you figure out
what changes and update the DB or wipe the DB and apply the new schema using
the aforementioned `setup_db.js` script.

## Contributing

Contributions of all kinds are welcomed but please explain what you did to
verify your change didn't cause a regression in your pull request. Writing a
new test case for your new feature is probably the best way to do this since
Travis will perform the tests for all pull requests.

Please ensure commits that land on master are self-contained changes and easily revertable. This
can be achieved through non-fast-forward pushes to PR branches for PRs that contain multiple
commits or by using GitHub's squash and merge feature when you merge the PR.

CI/Travis must pass before a PR can be merged. We look for test coverage in all commits but do not
require that codecov passes.
