import { User, UserRole } from './user';

/**
 * Options for creating a new user account.
 */
export type CreateUserOptions = {
  /** The unique username to apply to the account. */
  username: string;

  /** Optional. The email address to apply to the user account. */
  email?: string;

  /** Optional. The password to apply to the user account. */
  password?: string;

  /** Optional. The role to assign to the user account. This will default to `User`. Only admins can assign this to a higher value. */
  role?: UserRole;
};

/** Indicates the field on which a query for users should be sorted. */
export enum UserSortBy {
  /** Sort by relevance (text-based search) */
  Relevance = 'relevance',

  /** Sort alphabetically by username */
  Username = 'username',

  /** Sort by account creation date */
  MemberSince = 'memberSince',
}

/** Which order to return records in when querying. */
export enum SortOrder {
  /** Ascending order. */
  Ascending = 'asc',

  /** Descending order. */
  Descending = 'desc',
}

/** Options for performing a search of users. */
export type UserSearchCriteria = {
  /** Optional. A query string to search on. */
  query?: string;

  /** Optional. Filter which roles will be returned. Default is all roles. */
  roles?: UserRole[];

  /** Optional. Filter on whether locked or unlocked accounts will be returned. Default will be all accounts. */
  locked?: boolean;

  /** Optional. Skip first `skip` records. Useful for pagination. Default is 0. */
  skip?: number;

  /** Optional. Return up to `limit` records. Useful for pagination. Default is 200. */
  limit?: number;

  /** Optional. Indicates the order in which user records will be returned. Default is `relevance`. */
  sortBy?: UserSortBy;

  /** Optional. Indicate the order in which user records will be returned - ascending or descending. Default is `desc`. */
  sortOrder?: SortOrder;
};

/**
 * A class for creating and retrieving user accounts.
 */
export interface UserManager {
  /**
   * Attempts to authenticate a user.
   * @param usernameOrEmail The username or email on the user's account.
   * @param password The password on the user's account.
   * @returns Returns a Promise to return a {@link User} if successful, or `undefined`
   * if the user could not be authenticated for any reason.
   */
  authenticateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | undefined>;

  /**
   * Creates a new user account.
   * @param options A {@link CreateUserOptions} object indicating the properties the new account should be created with.
   * @returns Returns a Promise to return the new {@link User} account once it has been created.
   * @throws {ConflictError} Thrown if username or email is already taken.
   * @throws {ValidationError} Thrown if the username or email address is invalid, or if the password does not meet strength requirements.
   */
  createUser(options: CreateUserOptions): Promise<User>;

  /**
   * Attempts to retrieve a user account by its unique ID.
   * @param id The ID of the desired user account.
   * @returns Returns a Promise to return the user account if the ID was successfully found, or `undefined` if it wasn't.
   * @throws {ValidationError} Thrown if the ID is not a valid user ID.
   */
  getUserById(id: string): Promise<User | undefined>;

  /**
   * Attempts to retrieve a user account by its assigned username or email address.
   * @param id The username or email address assigned to the account.
   * @returns Returns a Promise to return the user account if it was successfully found, or `undefined` if it wasn't.
   * @throws {ValidationError} Thrown if the usernameOrEmail string is not a valid username or email address.
   */
  getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined>;

  /**
   * Performs a search for user accounts matching a set of search criteria.
   * @param options A set of options specifying the search criteria. If omitted, default criteria will be used.
   * @returns Returns an {@link AsyncGenerator} to iterate over the collection of {@link User}s returned from the database.
   * @throws {ValidationError} Thrown if any of the search criteria are invalid.
   */
  searchUsers(options?: UserSearchCriteria): Promise<User[]>;
}
