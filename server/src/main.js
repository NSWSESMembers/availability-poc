import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import JWT_SECRET from './config';
import { User } from './models';

import { executableSchema } from './schema';

const GRAPHQL_PORT = 8080;
const GRAPHQL_PATH = '/graphql';

const port = process.env.PORT ? process.env.PORT : GRAPHQL_PORT;

const app = express();

// `context` must be an object and can't be undefined when using connectors
app.use('/graphql', bodyParser.json(), jwt({
    secret: JWT_SECRET,
    credentialsRequired: false
  }), graphqlExpress(req => ({
    schema: executableSchema,
    context: {
      user: req.user ? User.findById(req.user.id) : Promise.resolve(null),
      device: req.user ? Device.findOne({ where: { uuid: req.user.device, userId: req.user.id } }) : Promise.resolve(null)
    },
  }))
);

app.use('/graphiql', graphiqlExpress({
  endpointURL: GRAPHQL_PATH,
}));

const graphQLServer = createServer(app);

graphQLServer.listen(port, () => {
  console.log(`GraphQL Server is now running on http://localhost:${port}${GRAPHQL_PATH}`);
});
