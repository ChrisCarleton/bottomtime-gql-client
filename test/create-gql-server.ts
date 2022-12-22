import { createYoga } from 'graphql-yoga';
import { createServer, Server } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Resolvers } from '../src/graphql';
import { typeDefs } from './schema';

function startServer(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.listen({ port: 4000 }, () => {
      resolve();
    });
  });
}

export async function createGqlServer(resolvers: Resolvers): Promise<Server> {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const graphqlServer = createYoga({
    schema,
  });

  const server = createServer(graphqlServer);
  await startServer(server);

  return server;
}
