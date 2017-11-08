import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';

import { executableSchema } from './schema';

const GRAPHQL_PORT = 8080;
const GRAPHQL_PATH = '/graphql';

const port = process.env.PORT ? process.env.PORT : GRAPHQL_PORT;

const app = express();

// `context` must be an object and can't be undefined when using connectors
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema,
  context: {}, // at least(!) an empty object
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: GRAPHQL_PATH,
}));

const graphQLServer = createServer(app);

graphQLServer.listen(port, () => {
  console.log(`GraphQL Server is now running on http://localhost:${port}${GRAPHQL_PATH}`);
});
