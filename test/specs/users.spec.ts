import { ApolloServer } from '@apollo/server';
import { BottomTime, createBottomTimeClient } from '../../src';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../schema';
import { Resolvers, UserEntity } from '../../src/graphql/types';
import { fakeUser } from '../fixtures/fake-user';
import { faker } from '@faker-js/faker';
import { GqlUser } from '../../src/users/gql-user';
import { UserRole } from '../../src/users';

const Users: UserEntity[] = [fakeUser(), fakeUser(), fakeUser()];

const UserResolvers: Resolvers = {
  Query: {
    usersGetById: () => Users[0],
    usersGetByUsernameOrEmail: () => Users[1],
    usersGetCurrent: () => Users[2],
    usersSearch: () => Users,
  },
};

describe('Users Module', () => {
  let testServer: ApolloServer;
  let client: BottomTime;

  beforeAll(async () => {
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: UserResolvers,
    });

    testServer = new ApolloServer({
      schema,
    });
    const { url } = await startStandaloneServer(testServer);
    client = await createBottomTimeClient(url);
  });

  afterAll(async () => {
    await testServer.stop();
  });

  describe('User Manager', () => {
    it('Will retrieve a user by ID', async () => {
      const expected = new GqlUser(Users[0]);
      const actual = await client.users.getUserById(
        faker.database.mongodbObjectId(),
      );
      expect(actual).toEqual(expected);
    });
  });
});
