import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import jwt from 'express-jwt';
import JWT_SECRET from './config';
import { User, Device } from './models';

import { executableSchema } from './schema';

const GRAPHQL_PORT = 8080;
const GRAPHQL_PATH = '/graphql';

const port = process.env.PORT ? process.env.PORT : GRAPHQL_PORT;

const app = express();

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
      user = User.findById(69);
      device = Device.findOne({
        where: {
          userId: 69,
          uuid: '1234abc',
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
      schema: executableSchema,
      context: {
        user,
        device,
      },
    };
  }),
);

app.use('/graphiql', graphiqlExpress({
  endpointURL: GRAPHQL_PATH,
}));

const graphQLServer = createServer(app);

graphQLServer.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`GraphQL Server is now running on http://localhost:${port}${GRAPHQL_PATH}`);
});
