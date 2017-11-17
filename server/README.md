# API Server for Availability

[![Build Status](https://travis-ci.org/NSWSESMembers/availability-poc.svg?branch=master)](https://travis-ci.org/NSWSESMembers/availability-poc)

This is an API server for Availability. It generates some standard data at boot
but otherwise allows for normal signups, logins and data mutations persisting
to a (sqlite)[https://www.sqlite.org] database using
(Sequelize)[http://docs.sequelizejs.com].

We plan to switch to using a proper networked RDBMS soon.

The server was originally built using the wonderful
(Chatty)[https://github.com/srtucker22/chatty]
(tutorial)[https://medium.com/react-native-training/building-chatty-a-whatsapp-clone-with-react-native-and-apollo-part-1-setup-68a02f7e11].

It uses:
* (Express)[https://expressjs.com] web framework
* (graphql-server-express)[https://www.npmjs.com/package/graphql-server-express]
  which integrates a (GraphQL)[http://graphql.org] server into Express
* (Sequelize)[http://docs.sequelizejs.com] to expose an ORM over the DB

## Install

Clone the repo, cd into the directory and run the following to install the
dependencies:
```sh
yarn
```

IMPORTANT: Edit `src/config.js` to set a secret.

## Run server

```sh
yarn run start
```


## Deploy

The server is deployed sporadically to Heroku (by @sdunster) by running:
```sh
yarn run deploy-heroku
```
You can play with the API
(here)[http://ses-availability-api.herokuapp.com/graphiql]. The data is wiped
whenever the Heroku web dyno is shut down or re-deployed.

If you'd like to deploy yourself you can build a bundle into `dist/` by
executing:
```sh
yarn run build
```

You can then execute the production-ready server bundle using:
```sh
yarn run serve
```
Or just execute `main.js`:
```sh
node dist/main.js
```

Once you have a server running you can access GraphQL at `/graphql` or you can
play with the API explorer at `/graphiql`.


## Contributing

Contributions of all kinds are welcomed but please explain what you did to
verify your change didn't cause a regression in your pull request. Writing a
new test case for your new feature is probably the best way to do this since
Travis will perform the tests for all pull requests.
