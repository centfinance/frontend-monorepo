import { GetAppGlobalPollingDataQuery } from '@repo/lib/shared/services/api/generated/graphql'
import { fakeTokenBySymbol } from '@repo/lib/test/data/all-gql-tokens.fake'
import { aGqlTokenPriceMock } from '@repo/lib/test/msw/builders/gqlTokenPrice.builders'

export function anAppGlobalData(options?: Partial<GetAppGlobalPollingDataQuery>) {
  const defaultAppGlobalData: GetAppGlobalPollingDataQuery = {
    __typename: 'Query',
    tokenGetCurrentPrices: [
      aGqlTokenPriceMock({ address: fakeTokenBySymbol('ETH').address }),
      aGqlTokenPriceMock({ address: fakeTokenBySymbol('BAL').address }),
    ],
  }
  return Object.assign({}, defaultAppGlobalData, options)
}
