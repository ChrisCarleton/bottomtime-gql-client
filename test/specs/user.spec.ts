import { createGqlServer } from '../create-gql-server';
import { GqlUser } from '../../src/users/gql-user';
import { Server } from 'http';
import { fakeUser } from '../fixtures/fake-user';
import { createBottomTimeClient } from '../../src';
import { TestServerUrl } from '../constants';
import { GraphQLClient } from '../../src/graphql/client';

jest.mock('@apollo/client/core');

const User = fakeUser();

describe('User', () => {
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

  it('Will return properties correctly', () => {
    const client = new GraphQLClient(TestServerUrl);
    const user = new GqlUser(client, User);

    expect(user.email).toEqual(User.email);
    expect(user.emailVerified).toEqual(User.emailVerified);
    expect(user.hasPassword).toEqual(User.hasPassword);
    expect(user.id).toEqual(User.id);
    expect(user.isLockedOut).toEqual(User.isLockedOut);
    expect(user.lastLogin?.toISOString()).toEqual(User.lastLogin);
    expect(user.memberSince.toISOString()).toEqual(User.memberSince);
    expect(user.role).toEqual(User.role);
    expect(user.username).toEqual(User.username);
  });
});
