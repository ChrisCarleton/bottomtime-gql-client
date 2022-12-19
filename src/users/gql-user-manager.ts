import { gql } from '@apollo/client/core';
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
import { UserAllFields } from './common';
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
            ...UserAllFields
          }
        }
        ${UserAllFields}
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
            ...UserAllFields
          }
        }
        ${UserAllFields}
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

  async getCurrentUser(): Promise<User | undefined> {
    const result = await this.client.query<{
      usersGetCurrent: Maybe<UserEntity>;
    }>(
      gql`
        query {
          usersGetCurrent {
            ...UserAllFields
          }
        }
        ${UserAllFields}
      `,
    );
    return result.usersGetCurrent
      ? new GqlUser(result.usersGetCurrent)
      : undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await this.client.query<
      { usersGetById: Maybe<UserEntity> },
      QueryUsersGetByIdArgs
    >(
      gql`
        query ($id: ID!) {
          usersGetById(id: $id) {
            ...UserAllFields
          }
        }
        ${UserAllFields}
      `,
      { id },
    );
    return result.usersGetById ? new GqlUser(result.usersGetById) : undefined;
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
            ...UserAllFields
          }
        }
        ${UserAllFields}
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
            ...UserAllFields
          }
        }
        ${UserAllFields}
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
