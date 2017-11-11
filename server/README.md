# API Server for Availability

This is an API server for Availability. It generates random data upon every
request using mocks. This is basically only good for experimenting and
validating the API. We'll make this actually store and mutate data soon.

## Install

```sh
yarn
```

Edit env.sh to set a secret.

## Run server

```sh
yarn run start
```

## Play with GraphiQL

http://localhost:8080/graphiql

## License

Final license decision pending - [MIT](../LICENSE.md) in the meantime.
