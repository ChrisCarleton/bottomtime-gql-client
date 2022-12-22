import { ServerParseError } from '@apollo/client/core';
import { GraphQLError } from 'graphql';
import {
  ConflictError,
  ServerError,
  ValidationError,
  ValidationErrorDetails,
} from '../errors';
import { CompoundError } from '../errors/compound-error';
import { GqlErrorCode } from '../users/common';

function graphQLErrorToException(gqlError: GraphQLError): Error {
  switch (gqlError.extensions?.code) {
    case GqlErrorCode.Conflict:
      return new ConflictError(gqlError.message);

    case GqlErrorCode.ValidationFailed:
      return new ValidationError(
        gqlError.message,
        gqlError.extensions?.details as ValidationErrorDetails[],
      );

    default:
      return new ServerError(gqlError.message);
  }
}

export function handleErrors(
  graphQLErrors: readonly GraphQLError[],
  networkError: Error | ServerError | ServerParseError | null,
) {
  if (graphQLErrors && graphQLErrors.length) {
    throw graphQLErrors.length === 1
      ? graphQLErrorToException(graphQLErrors[0])
      : new CompoundError(
          graphQLErrors.map((error) => graphQLErrorToException(error)),
        );
  }
}
