import { config } from '@repo/lib/config/app.config'
import { ApolloLink, HttpLink } from '@apollo/client'
import { ApolloClient, InMemoryCache, SSRMultipartLink } from '@apollo/client-integration-nextjs'

const defaultHeaders = {
  'x-graphql-client-name': 'FrontendClient',
  'x-graphql-client-version': '1.0.0',
}

export function createApolloClient() {
  // On the client side, use the Next.js rewrite proxy to avoid CORS issues.
  // On the server side, call the API directly.
  const uri = typeof window === 'undefined' ? config.apiUrl : '/api/graphql'

  const httpLink = new HttpLink({
    uri,
    headers: defaultHeaders,
  })

  return new ApolloClient({
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
    cache: new InMemoryCache({
      typePolicies: {
        GqlToken: {
          keyFields: ['address', 'chainId'],
        },
        GqlTokenPrice: {
          keyFields: ['address', 'chain'],
        },
        GqlUserPoolBalance: {
          keyFields: ['poolId'],
        },
        Query: {
          fields: {
            userGetPoolBalances: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: any[]) {
                return incoming
              },
            },
            userGetStaking: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: any[]) {
                return incoming
              },
            },
            poolGetBatchSwaps: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: any[]) {
                return incoming
              },
            },
          },
        },
      },
    }),
    queryDeduplication: true,
  })
}
