import 'babel-polyfill';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import url from 'url';
import { JWT_SECRET, DEFAULT_USER_ID, DEFAULT_DEVICE_UUID } from './config';
import { getSchema } from './schema';
import { setupDb } from './db';
import { getHandlers } from './logic';
import { getResolvers } from './resolvers';
import { getCreators } from './creators';
import { getCallback } from './callback';
import { getPushEmitters } from './push';
import { pubsub, getSubscriptionDetails } from './subscriptions';

const cors = require('cors');

const GRAPHQL_PORT = 8080;
const GRAPHQL_PATH = '/graphql';
const SUBSCRIPTIONS_PATH = '/subscriptions';

const port = process.env.PORT ? process.env.PORT : GRAPHQL_PORT;

const { models, db } = setupDb();
const creators = getCreators(models);
const { User, Device } = models;

const push = getPushEmitters({ models });

const handlers = getHandlers({ models, creators, push, pubsub });
const resolvers = getResolvers(handlers);
const schema = getSchema(resolvers);

const app = express();

app.use(cors());

// Take incoming JWT and resolve user and device and return it. If not passed then use DEFAULT
// user and device.
const postJWTAuth = ({ id, device }) => {
  let returnUser;
  let returnDevice;
  if (id && device) {
    returnUser = User.findById(id);
    returnDevice = Device.findOne({
      where: {
        userId: id,
        uuid: device,
      },
    });
  } else {
    returnUser = User.findById(DEFAULT_USER_ID);
    returnDevice = Device.findOne({
      where: {
        userId: DEFAULT_USER_ID,
        uuid: DEFAULT_DEVICE_UUID,
      },
    });
  }
  return Promise.resolve({ user: returnUser, device: returnDevice });
};

app.use(
  '/graphql',
  bodyParser.json(),
  // The JWT authentication middleware authenticates callers using a JWT.
  // If the token is valid, req.user will be set with the JSON object decoded to be
  // used by later middleware for authorization and access control.
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: !process.env.ALLOW_ANON,
  }),
  graphqlExpress(req => postJWTAuth(
    req.user ? { id: req.user.id, device: req.user.device } : { id: null, device: null },
  ).then(({ user, device }) => ({
    schema,
    context: {
      user,
      device,
    },
  })).catch(() => false),
  ),
);

app.use('/graphiql', graphiqlExpress(req => ({
  endpointURL: '/graphql',
  subscriptionsEndpoint: url.format({
    host: req.get('host'),
    protocol: req.protocol === 'https' ? 'wss' : 'ws',
    pathname: '/subscriptions',
  }),
})));

const graphQLServer = createServer(app);

SubscriptionServer.create({
  schema,
  execute,
  subscribe,
  onConnect(connectionParams) {
    // theres no standard auth header in WS so we use jwt connection param
    if (!connectionParams.jwt && !process.env.ALLOW_ANON) {
      return Promise.reject(Error('Unauthorised'));
    }
    return jsonwebtoken.verify(connectionParams.jwt || null, JWT_SECRET,
      (err, decoded) =>
        postJWTAuth(!err ? { id: decoded.id, device: decoded.device } : { id: null, device: null })
          .then(({ user, device }) => ({ user, device }))
          .catch(() => Promise.reject(Error('Unauthorised')),
          ),
    );
  },
  // unpack the subscription request and load it into context
  onOperation(parsedMessage, baseParams) {
    const { subscriptionName, args } = getSubscriptionDetails({
      baseParams,
      schema,
    });
    // if there is a specific function for this sub use it, otherwise use the default
    if (typeof (handlers.subscription[subscriptionName]) !== 'undefined') {
      return handlers.subscription[subscriptionName](baseParams, args, baseParams.context);
    }
    return handlers.subscription.defaultOnOperation(baseParams, args, baseParams.context);
  },
}, {
  server: graphQLServer,
  path: SUBSCRIPTIONS_PATH,
});

// Quick and simple health check endpoint that returns uptime and DB connector health
app.use('/healthcheck', (_, res) => {
  let status = 500;
  const response = {};
  response.dbConnected = false; // DB can connect
  response.dbDataLoad = false; // DB has an Organisation
  response.uptime = Math.round(process.uptime()); // Uptime of server
  try {
    db
      .authenticate()
      .then(() => {
        response.dbConnected = true;
        models.Organisation.findAll().then((orgResult) => {
          if (orgResult.length) {
            status = 200;
            response.dbDataLoad = true;
          }
          res.status(status).json(response);
        }).catch((e) => {
          response.dbDataLoad = e;
          res.status(status).json(response);
        });
      })
      .catch((e) => {
        response.dbConnector = e;
        res.status(status).json(response);
      });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.use('/hook', bodyParser.json(), getCallback('ses-hook', creators, models, push));

graphQLServer.listen(port, () => {
  console.log(`GraphQL Server is now running on http://localhost:${port}${GRAPHQL_PATH}`);
  console.log(`GraphQL Subscriptions are now running on ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`);
});
