import { gql, TypedDocumentNode } from '@apollo/client';
import {
  InputMaybe,
  Maybe,
  MutationUsersCreateArgs,
  MutationUsersLoginArgs,
  QueryUsersGetByIdArgs,
  QueryUsersGetByUsernameOrEmailArgs,
  QueryUsersSearchArgs,
  UserEntity,
} from '../graphql';
import { GraphQLClient } from '../graphql/client';
import { GqlUser } from './gql-user';
import { User } from './user';
import {
  CreateUserOptions,
  UserManager,
  UserSearchCriteria,
} from './user-manager';

export class GqlUserManager implements UserManager {
  constructor(private readonly client: GraphQLClient) {}

  async authenticateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | undefined> {
    const result = await this.client.mutate<
      Maybe<UserEntity>,
      MutationUsersLoginArgs
    >(
      gql`
        mutation authenticate($usernameOrEmail: String!, $password: String!) {
          usersLogin(usernameOrEmail: $usernameOrEmail, password: $password) {
            email
            emailVerified
            hasPassword
            id
            isLockedOut
            lastLogin
            memberSince
            role
            username
          }
        }
      `,
      { usernameOrEmail, password },
    );
    return result ? new GqlUser(result) : undefined;
  }

  async createUser(options: CreateUserOptions): Promise<User> {
    const result = await this.client.mutate<
      UserEntity,
      MutationUsersCreateArgs
    >(
      gql`
        mutation ($params: UserCreateParams!) {
          usersCreate(params: $params) {
            email
            emailVerified
            hasPassword
            id
            isLockedOut
            lastLogin
            memberSince
            role
            username
          }
        }
      `,
      {
        params: {
          username: options.username,
          email: options.email,
          password: options.password,
          role: options.role,
        },
      },
    );
    return new GqlUser(result!);
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await this.client.query<
      Maybe<UserEntity>,
      QueryUsersGetByIdArgs
    >(
      gql`
        query ($id: ID!) {
          usersGetById(id: $id) {
            email
            emailVerified
            hasPassword
            id
            isLockedOut
            lastLogin
            memberSince
            role
            username
          }
        }
      `,
      { id },
    );
    return result ? new GqlUser(result) : undefined;
  }

  async getUserByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | undefined> {
    const result = await this.client.query<
      Maybe<UserEntity>,
      QueryUsersGetByUsernameOrEmailArgs
    >(
      gql`
        query ($id: ID!) {
          usersGetByUsernameOrEmail(id: $id) {
            email
            emailVerified
            hasPassword
            id
            isLockedOut
            lastLogin
            memberSince
            role
            username
          }
        }
      `,
      { usernameOrEmail },
    );
    return result ? new GqlUser(result) : undefined;
  }

  async searchUsers(options?: UserSearchCriteria | undefined): Promise<User[]> {
    const results = await this.client.query<
      UserEntity[],
      InputMaybe<QueryUsersSearchArgs>
    >(
      gql`
        query ($params: UserSearchParams) {
          usersSearch(params: $params) {
            email
            emailVerified
            hasPassword
            id
            isLockedOut
            lastLogin
            memberSince
            role
            username
          }
        }
      `,
      {
        params: {
          query: options?.query,
          roles: options?.roles,
          locked: options?.locked,

          sortBy: options?.sortBy,
          sortOrder: options?.sortOrder,

          skip: options?.skip,
          limit: options?.limit,
        },
      },
    );
    return results.map((result) => new GqlUser(result));
  }
}
