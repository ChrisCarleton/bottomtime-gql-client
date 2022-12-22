import { GraphQLError } from 'graphql';
import { GqlErrorCode } from '../src/users/common';

export function createGraphQLError(
  code: GqlErrorCode,
  message?: string,
): GraphQLError {
  return new GraphQLError(message ?? 'Error!', {
    extensions: {
      code,
    },
  });
}
