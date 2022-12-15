import { ErrorResponse } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import { CompoundError } from '../errors/compound-error';

function graphQLErrorToException(gqlError: GraphQLError): Error {
  return new Error();
}

export function handleError({ graphQLErrors, networkError }: ErrorResponse) {
  if (graphQLErrors && graphQLErrors.length) {
    throw graphQLErrors.length === 1
      ? graphQLErrorToException(graphQLErrors[0])
      : new CompoundError(
          graphQLErrors.map((error) => graphQLErrorToException(error)),
        );
  }

  if (networkError) {
    throw new Error(`[${networkError.name}] ${networkError.message}`);
  }
}
