import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  TypedDocumentNode,
} from '@apollo/client/core';
import fetch from 'cross-fetch';
import { GraphQLError } from 'graphql';
import { handleError } from './error-handler';
import { onError } from '@apollo/client/link/error';

export class GraphQLClient {
  private readonly client: ApolloClient<NormalizedCacheObject>;

  constructor(uri: string) {
    const link = from([
      onError(handleError),
      new HttpLink({
        uri,
        credentials: 'include',
        fetch,
      }),
    ]);

    this.client = new ApolloClient({
      link,
      cache: new InMemoryCache(),

      name: 'bottomtime-node-client',
      version: '1.0.0', // TODO: How do I grab this from the package.json file?

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

  async query<TReturn, TArgs = any>(
    query: TypedDocumentNode<TReturn, TArgs>,
    variables?: TArgs,
  ): Promise<TReturn> {
    const result = await this.client.query<TReturn, TArgs>({
      query,
      variables,
    });

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

    if (!result.data) {
      // TODO: Make a better exception for this...
      throw new Error('Wat?');
    }

    return result.data;
  }
}
