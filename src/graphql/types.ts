import { UserRole } from '../users';
import Role = UserRole;
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
export type EnumResolverSignature<T, AllowedValues = any> = {
  [key in keyof T]?: AllowedValues;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: string;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change a user's email address. */
  usersChangeEmail: Scalars['Boolean'];
  /** Allows a user to change their password. */
  usersChangePassword: Scalars['Boolean'];
  /** Changes a user's role. */
  usersChangeRole: Scalars['Boolean'];
  /** Change a user's username. */
  usersChangeUsername: Scalars['Boolean'];
  /** Creates a new user account. */
  usersCreate: UserEntity;
  /** Forcefully, reset a users password. (Admins only.) */
  usersForceResetPassword: Scalars['Boolean'];
  /** Locks (suspends) a user account. */
  usersLockAccount: Scalars['Boolean'];
  /**
   * Attempts to authenticate a user. If successful, will return the user account info and the session cookie will be updated
   * to reflect the user's identity.
   */
  usersLogin?: Maybe<UserEntity>;
  /** Logs out the currently logged-in user. */
  usersLogout: Scalars['Boolean'];
  /** Requests an email verification token be sent out to the indicated email address. */
  usersRequestEmailVerification: Scalars['Boolean'];
  /** Requests a password reset email be sent out to the indicated user. */
  usersRequestPasswordReset: Scalars['Boolean'];
  /** Attempts to reset a user's password using a reset token. */
  usersResetPassword: Scalars['Boolean'];
  /** Unlocks a previously suspended account. */
  usersUnlockAccount: Scalars['Boolean'];
  /** Attempts to verify an email address given a verification token. */
  usersVerifyEmailAddress: Scalars['Boolean'];
};

export type MutationUsersChangeEmailArgs = {
  newEmail: Scalars['String'];
  userId: Scalars['ID'];
};

export type MutationUsersChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type MutationUsersChangeRoleArgs = {
  newRole: Role;
  userId: Scalars['ID'];
};

export type MutationUsersChangeUsernameArgs = {
  newUsername: Scalars['String'];
  userId: Scalars['ID'];
};

export type MutationUsersCreateArgs = {
  params: UserCreateParams;
};

export type MutationUsersForceResetPasswordArgs = {
  newPassword: Scalars['String'];
  userId: Scalars['ID'];
};

export type MutationUsersLockAccountArgs = {
  userId: Scalars['ID'];
};

export type MutationUsersLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type MutationUsersRequestEmailVerificationArgs = {
  email: Scalars['String'];
};

export type MutationUsersRequestPasswordResetArgs = {
  usernameOrEmail: Scalars['String'];
};

export type MutationUsersResetPasswordArgs = {
  newPassword: Scalars['String'];
  resetToken: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type MutationUsersUnlockAccountArgs = {
  userId: Scalars['ID'];
};

export type MutationUsersVerifyEmailAddressArgs = {
  email: Scalars['String'];
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Attempts to retrieve a user account by its ID. */
  usersGetById?: Maybe<UserEntity>;
  /** Attempts to get a user account by its username or email address. */
  usersGetByUsernameOrEmail?: Maybe<UserEntity>;
  /** Get the currently logged-in user. */
  usersGetCurrent?: Maybe<UserEntity>;
  /** Performs a search for user accounts. */
  usersSearch: Array<UserEntity>;
};

export type QueryUsersGetByIdArgs = {
  id: Scalars['ID'];
};

export type QueryUsersGetByUsernameOrEmailArgs = {
  usernameOrEmail: Scalars['String'];
};

export type QueryUsersSearchArgs = {
  params?: InputMaybe<UserSearchParams>;
};

export { Role };

export type UserCreateParams = {
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Role>;
  username: Scalars['String'];
};

/** Represents a user account */
export type UserEntity = {
  __typename?: 'UserEntity';
  /** The user's email address. */
  email?: Maybe<Scalars['String']>;
  /** Whether or not the user's email address has been verified. */
  emailVerified: Scalars['Boolean'];
  /** Whether or not the user account has a password set. */
  hasPassword: Scalars['Boolean'];
  /** The user account's unique ID. This will never change. */
  id: Scalars['ID'];
  /** Whether or not the user account is currently suspended (locked out) */
  isLockedOut: Scalars['Boolean'];
  /** An ISO-formatted date and time indicating when the user last logged indicating when the user last logged indicating */
  lastLogin?: Maybe<Scalars['Date']>;
  /** An ISO-formatted date and time indicating when the account was first created. */
  memberSince: Scalars['Date'];
  /** The user's role. Currently, only "user" and "admin" are supported */
  role: Role;
  /** The user's unique Username. This can be changed by the user. Use id if you need a more permanent identifier. */
  username: Scalars['String'];
};

export type UserSearchParams = {
  limit?: InputMaybe<Scalars['Int']>;
  locked?: InputMaybe<Scalars['Boolean']>;
  query?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<Role>>;
  skip?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Role: UserRole;
  String: ResolverTypeWrapper<Scalars['String']>;
  UserCreateParams: UserCreateParams;
  UserEntity: ResolverTypeWrapper<UserEntity>;
  UserSearchParams: UserSearchParams;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  UserCreateParams: UserCreateParams;
  UserEntity: UserEntity;
  UserSearchParams: UserSearchParams;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  usersChangeEmail?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersChangeEmailArgs, 'newEmail' | 'userId'>
  >;
  usersChangePassword?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUsersChangePasswordArgs,
      'newPassword' | 'oldPassword'
    >
  >;
  usersChangeRole?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersChangeRoleArgs, 'newRole' | 'userId'>
  >;
  usersChangeUsername?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersChangeUsernameArgs, 'newUsername' | 'userId'>
  >;
  usersCreate?: Resolver<
    ResolversTypes['UserEntity'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersCreateArgs, 'params'>
  >;
  usersForceResetPassword?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersForceResetPasswordArgs, 'newPassword' | 'userId'>
  >;
  usersLockAccount?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersLockAccountArgs, 'userId'>
  >;
  usersLogin?: Resolver<
    Maybe<ResolversTypes['UserEntity']>,
    ParentType,
    ContextType,
    RequireFields<MutationUsersLoginArgs, 'password' | 'usernameOrEmail'>
  >;
  usersLogout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  usersRequestEmailVerification?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersRequestEmailVerificationArgs, 'email'>
  >;
  usersRequestPasswordReset?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersRequestPasswordResetArgs, 'usernameOrEmail'>
  >;
  usersResetPassword?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUsersResetPasswordArgs,
      'newPassword' | 'resetToken' | 'usernameOrEmail'
    >
  >;
  usersUnlockAccount?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersUnlockAccountArgs, 'userId'>
  >;
  usersVerifyEmailAddress?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUsersVerifyEmailAddressArgs, 'email' | 'token'>
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  usersGetById?: Resolver<
    Maybe<ResolversTypes['UserEntity']>,
    ParentType,
    ContextType,
    RequireFields<QueryUsersGetByIdArgs, 'id'>
  >;
  usersGetByUsernameOrEmail?: Resolver<
    Maybe<ResolversTypes['UserEntity']>,
    ParentType,
    ContextType,
    RequireFields<QueryUsersGetByUsernameOrEmailArgs, 'usernameOrEmail'>
  >;
  usersGetCurrent?: Resolver<
    Maybe<ResolversTypes['UserEntity']>,
    ParentType,
    ContextType
  >;
  usersSearch?: Resolver<
    Array<ResolversTypes['UserEntity']>,
    ParentType,
    ContextType,
    Partial<QueryUsersSearchArgs>
  >;
};

export type RoleResolvers = EnumResolverSignature<
  { Admin?: any; User?: any },
  ResolversTypes['Role']
>;

export type UserEntityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserEntity'] = ResolversParentTypes['UserEntity'],
> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isLockedOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastLogin?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  memberSince?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers;
  UserEntity?: UserEntityResolvers<ContextType>;
};
