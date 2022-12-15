import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  TypedDocumentNode,
} from '@apollo/client';
import { GraphQLError } from 'graphql';

import packageInfo from '../../package.json';

export class GraphQLClient {
  private readonly client: ApolloClient<NormalizedCacheObject>;

  constructor(uri: string) {
    const link = new HttpLink({
      uri,
      credentials: 'include',
    });

    this.client = new ApolloClient({
      link,
      cache: new InMemoryCache(),

      name: packageInfo.name,
      version: packageInfo.version,

      defaultOptions: {
        watchQuery: {
          errorPolicy: 'none',
        },
        query: {
          errorPolicy: 'none',
        },
        mutate: {
          errorPolicy: 'none',
        },
      },
    });
  }

  private handleError(errors: readonly GraphQLError[]) {}

  async query<TReturn, TArgs>(
    query: TypedDocumentNode<TReturn, TArgs>,
    variables?: TArgs,
  ): Promise<TReturn> {
    const result = await this.client.query<TReturn, TArgs>({
      query,
      variables,
    });

    if (result.errors) {
      this.handleError(result.errors);
    }

    return result.data;
  }

  async mutate<TReturn, TArgs>(
    mutation: TypedDocumentNode<TReturn, TArgs>,
    variables?: TArgs,
  ): Promise<TReturn> {
    const result = await this.client.mutate<TReturn, TArgs>({
      mutation,
      variables,
    });

    if (result.errors) {
      this.handleError(result.errors);
    }

    if (!result.data) {
      // TODO: Make a better exception for this...
      throw new Error('Wat?');
    }

    return result.data;
  }
}
