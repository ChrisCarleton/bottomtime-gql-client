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
      { usersLogin: Maybe<UserEntity> },
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
    return result.usersLogin
      ? new GqlUser(this.client, result.usersLogin)
      : undefined;
  }

  async createUser(options: CreateUserOptions): Promise<User> {
    const result = await this.client.mutate<
      { usersCreate: UserEntity },
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
    return new GqlUser(this.client, result.usersCreate);
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
      ? new GqlUser(this.client, result.usersGetCurrent)
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
    return result.usersGetById
      ? new GqlUser(this.client, result.usersGetById)
      : undefined;
  }

  async getUserByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | undefined> {
    const result = await this.client.query<
      { usersGetByUsernameOrEmail: Maybe<UserEntity> },
      QueryUsersGetByUsernameOrEmailArgs
    >(
      gql`
        query ($usernameOrEmail: String!) {
          usersGetByUsernameOrEmail(usernameOrEmail: $usernameOrEmail) {
            ...UserAllFields
          }
        }
        ${UserAllFields}
      `,
      { usernameOrEmail },
    );
    return result.usersGetByUsernameOrEmail
      ? new GqlUser(this.client, result.usersGetByUsernameOrEmail)
      : undefined;
  }

  async searchUsers(options?: UserSearchCriteria | undefined): Promise<User[]> {
    const results = await this.client.query<
      { usersSearch: UserEntity[] },
      QueryUsersSearchArgs
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
    return results.usersSearch.map(
      (result) => new GqlUser(this.client, result),
    );
  }
}
