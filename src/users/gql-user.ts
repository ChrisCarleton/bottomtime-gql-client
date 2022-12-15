import { UserEntity } from '../graphql';
import { User, UserRole } from './user';

export class GqlUser implements User {
  constructor(private readonly data: UserEntity) {}

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

  changeUsername(newUsername: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  changeEmail(newEmail: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getEmailVerificationToken(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  verifyEmail(verificationToken: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  lockAccount(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  unlockAccount(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getPasswordResetToken(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  resetPassword(token: string, newPassword: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  forceResetPassword(newPassword: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  changeRole(newRole: UserRole): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
