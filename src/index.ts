import { GraphQLClient } from './graphql/client';
import { UserManager } from './users';
import { GqlUserManager } from './users/gql-user-manager';

export interface BottomTime {
  users: UserManager;
}

export function createBottomTimeClient(uri: string): BottomTime {
  const client = new GraphQLClient(uri);

  return {
    users: new GqlUserManager(client),
  };
}
