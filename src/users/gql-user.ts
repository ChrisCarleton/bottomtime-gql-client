import { gql } from '@apollo/client/core';
import {
  MutationUsersChangeEmailArgs,
  MutationUsersChangeUsernameArgs,
  UserEntity,
} from '../graphql';
import { GraphQLClient } from '../graphql/client';
import { User, UserRole } from './user';

export class GqlUser implements User {
  constructor(
    private readonly client: GraphQLClient,
    private readonly data: UserEntity,
  ) {}

  get id(): string {
    return this.data.id;
  }

  get username(): string {
    return this.data.username;
  }

  get lastLogin(): Date | undefined {
    return this.data.lastLogin ? new Date(this.data.lastLogin) : undefined;
  }

  get memberSince(): Date {
    return new Date(this.data.memberSince);
  }

  get email(): string | undefined {
    return this.data.email ?? undefined;
  }

  get emailVerified(): boolean {
    return this.data.emailVerified;
  }

  get hasPassword(): boolean {
    return this.data.hasPassword;
  }

  get isLockedOut(): boolean {
    return this.data.isLockedOut;
  }

  get role(): UserRole {
    return this.data.role;
  }

  async changeUsername(newUsername: string): Promise<void> {
    await this.client.mutate<
      { usersChagneUsername: boolean },
      MutationUsersChangeUsernameArgs
    >(
      gql`
        mutation changeUsername($newUsername: String!, $userId: ID!) {
          usersChangeUsername(newUsername: $newUsername, userId: $userId)
        }
      `,
      {
        userId: this.id,
        newUsername,
      },
    );
    this.data.username = newUsername;
  }

  async changeEmail(newEmail: string): Promise<void> {
    await this.client.mutate<
      { usersChangeEmail: boolean },
      MutationUsersChangeEmailArgs
    >(
      gql`
        mutation changeUsername($newEmail: String!, $userId: ID!) {
          usersChangeEmail(newEmail: $newEmail, userId: $userId)
        }
      `,
      {
        userId: this.id,
        newEmail,
      },
    );
    this.data.email = newEmail;
  }

  getEmailVerificationToken(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  verifyEmail(verificationToken: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  lockAccount(): Promise<void> {
    this.data.isLockedOut = true;
    throw new Error('Method not implemented.');
  }

  unlockAccount(): Promise<void> {
    this.data.isLockedOut = false;
    throw new Error('Method not implemented.');
  }

  changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    this.data.hasPassword = true;
    throw new Error('Method not implemented.');
  }

  getPasswordResetToken(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  resetPassword(token: string, newPassword: string): Promise<boolean> {
    this.data.hasPassword = true;
    throw new Error('Method not implemented.');
  }

  forceResetPassword(newPassword: string): Promise<void> {
    this.data.hasPassword = true;
    throw new Error('Method not implemented.');
  }

  changeRole(newRole: UserRole): Promise<void> {
    this.data.role = newRole;
    throw new Error('Method not implemented.');
  }

  toJSON(): Record<string, unknown> {
    return {
      ...this.data,
    };
  }
}
