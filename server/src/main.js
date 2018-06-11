import 'babel-polyfill';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import jwt from 'express-jwt';
import { JWT_SECRET, DEFAULT_USER_ID, DEFAULT_DEVICE_UUID } from './config';
import { getSchema } from './schema';
import { setupDb } from './db';
import { getHandlers } from './logic';
import { getResolvers } from './resolvers';
import { getCreators } from './creators';
import { getCallback } from './callback';
import { getPushEmitters } from './push';

const cors = require('cors');

const GRAPHQL_PORT = 8080;
const GRAPHQL_PATH = '/graphql';

const port = process.env.PORT ? process.env.PORT : GRAPHQL_PORT;

const { models, db } = setupDb();
const creators = getCreators(models);
const { User, Device } = models;

const push = getPushEmitters({ models });

const handlers = getHandlers({ models, creators, push });
const resolvers = getResolvers(handlers);
const schema = getSchema(resolvers);


const app = express();

app.use(cors());

// `context` must be an object and can't be undefined when using connectors
app.use(
  '/graphql',
  bodyParser.json(),
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
  }),
  graphqlExpress((req) => {
    let user;
    let device;

    // if the user is not logged in we assume they are the test user
    // to ease testing and enable the use of GraphiQL
    if (typeof req.user === 'undefined') {
      user = User.findById(DEFAULT_USER_ID);
      device = Device.findOne({
        where: {
          userId: DEFAULT_USER_ID,
          uuid: DEFAULT_DEVICE_UUID,
        },
      });
    } else {
      user = User.findById(req.user.id);
      device = Device.findOne({
        where: {
          userId: req.user.id,
          uuid: req.user.device,
        },
      });
    }

    return {
      schema,
      context: {
        user,
        device,
      },
    };
  }),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: GRAPHQL_PATH,
  }),
);

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

const graphQLServer = createServer(app);

graphQLServer.listen(port, () => {
  console.log(`GraphQL Server is now running on http://localhost:${port}${GRAPHQL_PATH}`);
});
