import { createServer, Server } from 'http';
import { createYoga } from 'graphql-yoga';
import { createBottomTimeClient } from '../../src';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../schema';
import { Resolvers, UserEntity } from '../../src/graphql/types';
import { fakeUser } from '../fixtures/fake-user';
import { faker } from '@faker-js/faker';
import { GqlUser } from '../../src/users/gql-user';

const Users: UserEntity[] = [fakeUser(), fakeUser(), fakeUser()];

function createGqlServer(resolvers: Resolvers): Server {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const graphqlServer = createYoga({
    schema,
  });

  return createServer(graphqlServer);
}

function startServer(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.listen({ port: 4000 }, () => {
      resolve();
    });
  });
}

describe('Users Module', () => {
  let testServer: Server | undefined;

  afterEach((done) => {
    if (testServer) {
      testServer.close(done);
      testServer = undefined;
    }
  });

  describe('User Manager', () => {
    describe('Get User By ID', () => {
      it('Will retrieve a user by ID', async () => {
        const spy = jest.fn().mockResolvedValue(Users[0]);
        const id = faker.database.mongodbObjectId();
        testServer = createGqlServer({
          Query: {
            usersGetById: spy,
          },
        });
        await startServer(testServer);
        const client = createBottomTimeClient('http://localhost:4000/graphql');

        const expected = new GqlUser(Users[0]);
        const actual = await client.users.getUserById(id);
        expect(actual).toEqual(expected);
        expect(spy).toBeCalled();
        const [_, args] = spy.mock.lastCall;
        expect(args).toEqual({ id });
      });

      it('Will return undefined if user ID cannot be found', async () => {
        const spy = jest.fn().mockResolvedValue(null);
        const id = faker.database.mongodbObjectId();
        testServer = createGqlServer({
          Query: {
            usersGetById: spy,
          },
        });
        await startServer(testServer);
        const client = createBottomTimeClient('http://localhost:4000/graphql');

        const actual = await client.users.getUserById(id);
        expect(actual).toBeUndefined();
        expect(spy).toBeCalled();
        const [_, args] = spy.mock.lastCall;
        expect(args).toEqual({ id });
      });
    });

    describe('Get Current User', () => {
      it('Will return a user if logged in', async () => {
        const spy = jest.fn().mockResolvedValue(Users[0]);
        testServer = createGqlServer({
          Query: {
            usersGetCurrent: spy,
          },
        });
        await startServer(testServer);
        const client = createBottomTimeClient('http://localhost:4000/graphql');

        const expected = new GqlUser(Users[0]);
        const actual = await client.users.getCurrentUser();
        expect(actual).toEqual(expected);
        expect(spy).toBeCalled();
      });

      it('Will return undefined if user is not logged in', async () => {
        const spy = jest.fn().mockResolvedValue(null);
        testServer = createGqlServer({
          Query: {
            usersGetCurrent: spy,
          },
        });
        await startServer(testServer);
        const client = createBottomTimeClient('http://localhost:4000/graphql');

        const actual = await client.users.getCurrentUser();
        expect(actual).toBeUndefined();
        expect(spy).toBeCalled();
      });
    });
  });
});
