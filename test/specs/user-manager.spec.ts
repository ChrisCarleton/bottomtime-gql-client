import { Server } from 'http';
import {
  ConflictError,
  createBottomTimeClient,
  ValidationError,
} from '../../src';
import { UserEntity } from '../../src/graphql/types';
import { fakeUser } from '../fixtures/fake-user';
import { faker } from '@faker-js/faker';
import { TestServerUrl } from '../constants';
import {
  CreateUserOptions,
  SortOrder,
  UserRole,
  UserSearchCriteria,
  UserSortBy,
} from '../../src/users';
import { createGraphQLError } from '../graphql-error';
import { GqlErrorCode } from '../../src/users/common';
import { createGqlServer } from '../create-gql-server';

const Users: UserEntity[] = [fakeUser(), fakeUser(), fakeUser()];

describe('Users Manager', () => {
  let testServer: Server | undefined;

  afterEach((done) => {
    if (testServer) {
      testServer.close(() => {
        testServer = undefined;
        done();
      });
    } else {
      done();
    }
  });

  describe('Get User By ID', () => {
    it('Will retrieve a user by ID', async () => {
      const spy = jest.fn().mockResolvedValue(Users[0]);
      const id = faker.database.mongodbObjectId();
      testServer = await createGqlServer({
        Query: {
          usersGetById: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const expected = Users[0];
      const actual = await client.users.getUserById(id);
      expect(actual?.toJSON()).toEqual(expected);
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ id });
    });

    it('Will return undefined if user ID cannot be found', async () => {
      const spy = jest.fn().mockResolvedValue(null);
      const id = faker.database.mongodbObjectId();
      testServer = await createGqlServer({
        Query: {
          usersGetById: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

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
      testServer = await createGqlServer({
        Query: {
          usersGetCurrent: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const expected = Users[0];
      const actual = await client.users.getCurrentUser();
      expect(actual?.toJSON()).toEqual(expected);
      expect(spy).toBeCalled();
    });

    it('Will return undefined if user is not logged in', async () => {
      const spy = jest.fn().mockResolvedValue(null);
      testServer = await createGqlServer({
        Query: {
          usersGetCurrent: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const actual = await client.users.getCurrentUser();
      expect(actual).toBeUndefined();
      expect(spy).toBeCalled();
    });
  });

  describe('Get User By Username Or Email', () => {
    it('Will retrieve user', async () => {
      const spy = jest.fn().mockResolvedValue(Users[2]);
      testServer = await createGqlServer({
        Query: {
          usersGetByUsernameOrEmail: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const expected = Users[2];
      const actual = await client.users.getUserByUsernameOrEmail(
        Users[2].email!,
      );
      expect(actual?.toJSON()).toEqual(expected);
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ usernameOrEmail: Users[2].email });
    });

    it('Will return undefined if user is not found', async () => {
      const email = faker.internet.email();
      const spy = jest.fn().mockResolvedValue(undefined);
      testServer = await createGqlServer({
        Query: {
          usersGetByUsernameOrEmail: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const actual = await client.users.getUserByUsernameOrEmail(email);
      expect(actual?.toJSON()).toBeUndefined();
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ usernameOrEmail: email });
    });
  });

  describe('Authenticate User', () => {
    it('Will return a user if authentication succeeds', async () => {
      const username = faker.internet.userName();
      const password = faker.internet.password();
      const spy = jest.fn().mockResolvedValue(Users[1]);
      testServer = await createGqlServer({
        Mutation: {
          usersLogin: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const expected = Users[1];
      const actual = await client.users.authenticateUser(username, password);
      expect(actual?.toJSON()).toEqual(expected);
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ usernameOrEmail: username, password });
    });

    it('Will return undefined if authentication fails', async () => {
      const username = faker.internet.userName();
      const password = faker.internet.password();
      const spy = jest.fn().mockResolvedValue(undefined);
      testServer = await createGqlServer({
        Mutation: {
          usersLogin: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const actual = await client.users.authenticateUser(username, password);
      expect(actual).toBeUndefined();
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ usernameOrEmail: username, password });
    });
  });

  describe('Search Users', () => {
    it('Will return array of users', async () => {
      const searchCriteria: UserSearchCriteria = {
        query: 'Bob',
        roles: [UserRole.User, UserRole.Admin],
        locked: false,
        skip: 0,
        limit: 150,
        sortBy: UserSortBy.Username,
        sortOrder: SortOrder.Ascending,
      };
      const spy = jest.fn().mockResolvedValue(Users);
      testServer = await createGqlServer({
        Query: {
          usersSearch: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const expected = Users;
      const actual = await client.users.searchUsers(searchCriteria);
      expect(actual!.map((user) => user.toJSON())).toEqual(expected);
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ params: searchCriteria });
    });

    it('Will throw a validation error if search criteria is invalid', async () => {
      const searchCriteria: UserSearchCriteria = {};
      const spy = jest
        .fn()
        .mockRejectedValue(createGraphQLError(GqlErrorCode.ValidationFailed));
      testServer = await createGqlServer({
        Query: {
          usersSearch: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      await expect(
        client.users.searchUsers(searchCriteria),
      ).rejects.toThrowError(ValidationError);
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ params: searchCriteria });
    });
  });

  describe('Create User', () => {
    it('Will return a user if successful', async () => {
      const options: CreateUserOptions = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.User,
      };
      const spy = jest.fn().mockResolvedValue(Users[0]);
      testServer = await createGqlServer({
        Mutation: {
          usersCreate: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      const expected = Users[0];
      const actual = await client.users.createUser(options);
      expect(actual?.toJSON()).toEqual(expected);
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ params: options });
    });

    it('Will throw a validation error if validation fails', async () => {
      const options: CreateUserOptions = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.User,
      };
      const spy = jest
        .fn()
        .mockRejectedValue(createGraphQLError(GqlErrorCode.ValidationFailed));
      testServer = await createGqlServer({
        Mutation: {
          usersCreate: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      await expect(client.users.createUser(options)).rejects.toThrowError(
        ValidationError,
      );
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ params: options });
    });

    it('Will throw a conflict error if username or email is taken', async () => {
      const options: CreateUserOptions = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.User,
      };
      const spy = jest
        .fn()
        .mockRejectedValue(createGraphQLError(GqlErrorCode.Conflict));
      testServer = await createGqlServer({
        Mutation: {
          usersCreate: spy,
        },
      });
      const client = createBottomTimeClient(TestServerUrl);

      await expect(client.users.createUser(options)).rejects.toThrowError(
        ConflictError,
      );
      expect(spy).toBeCalled();
      const [_, args] = spy.mock.lastCall;
      expect(args).toEqual({ params: options });
    });
  });
});
