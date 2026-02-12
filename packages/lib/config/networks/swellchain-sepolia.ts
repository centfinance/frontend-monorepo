import { GqlChain } from '@repo/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'
import { convertHexToLowerCase } from '@repo/lib/shared/utils/objects'

const networkConfig: NetworkConfig = {
  chainId: 1924,
  name: 'Swellchain Sepolia Testnet',
  shortName: 'Swell Sepolia',
  chain: GqlChain.SwellchainSepolia,
  iconPath: '/images/chains/SWELLCHAIN_SEPOLIA.svg',
  blockExplorer: {
    baseUrl: 'https://sepolia.swellchainscan.io',
    name: 'SwellchainScan',
  },
  tokens: {
    addresses: {
      bal: '0x0000000000000000000000000000000000000000', // No BAL on this chain
      wNativeAsset: '0x0000000000000000000000000000000000000000', // TODO: Set WETH address when deployed
    },
    nativeAsset: {
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  },
  contracts: {
    multicall2: '0xcA11bde05977b3631167028862bE2a173976CA11',
    permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
    balancer: {
      vaultV2: '0x0000000000000000000000000000000000000000', // No v2 on this chain
      vaultV3: '0x89d3Bdfc7F9b3C6F07daa20366F6DC48a65daE07',
      vaultAdminV3: '0x2a42891eD6d05B355fDE3abBB301DE01B596e3db',
      router: '0x360667b615962d7FE35F8B566c53E046D69A578F',
      batchRouter: '0x81df0522Fb2c636C3f53809D50b98cd5508a41AE',
      relayerV6: '0x0000000000000000000000000000000000000000', // No relayer on this chain
      minter: '0x0000000000000000000000000000000000000000', // No minter on this chain
    },
  },
  pools: convertHexToLowerCase({
    issues: {},
  }),
}

export default networkConfig
