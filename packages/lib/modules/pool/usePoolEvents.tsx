import {
  GqlChain,
  GetPoolEventsDocument,
  GqlPoolEventType,
  GetPoolEventsQuery,
} from '@repo/lib/shared/services/api/generated/graphql'
import { FetchPolicy } from '@apollo/client'
import { useQuery } from '@apollo/client'

type PoolEventList = GetPoolEventsQuery['poolEvents']
export type PoolEventItem = PoolEventList[0]

type PoolEventsProps = {
  poolIdIn?: string[]
  chainIn?: GqlChain[]
  first?: number
  skip?: number
  type?: GqlPoolEventType
  userAddress?: string
}

export function usePoolEvents(
  { poolIdIn, chainIn, first, skip, type, userAddress }: PoolEventsProps,
  opts: { skip?: boolean; fetchPolicy?: FetchPolicy } = {}
) {
  // Use the first pool ID if provided (API accepts single poolId)
  const poolId = poolIdIn?.[0]?.toLowerCase()

  return useQuery(GetPoolEventsDocument, {
    variables: {
      poolId,
      chainIn: chainIn || [],
      first,
      skip,
      type,
      userAddress,
    },
    ...opts,
  })
}
