import { gql } from '@apollo/client/core';

export enum GqlErrorCode {
  /* Custom Errors */
  Conflict = 'CONFLICT',
  Forbidden = 'FORBIDDEN',
  Unauthorized = 'UNAUTHORIZED',

  /* Built-in Apollo Server Errors */
  BadRequest = 'BAD_REQUEST',
  GqlSchema = 'GRAPHQL_VALIDATION_FAILED',
  GqlSyntax = 'GRAPHQL_PARSE_FAILED',
  OperationResolution = 'OPERATION_RESOLUTION_FAILURE',
  PersistedQueryNotFound = 'PERSISTED_QUERY_NOT_FOUND',
  PersistedQueryNotSupported = 'PERSISTED_QUERY_NOT_SUPPORTED',
  ServerError = 'INTERNAL_SERVER_ERROR',
  ValidationFailed = 'BAD_USER_INPUT',
}

export const UserAllFields = gql`
  fragment UserAllFields on UserEntity {
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
`;
