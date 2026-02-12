/**
 * Runtime patches for the Balancer SDK to support custom chains (e.g. Swellchain Sepolia)
 * that are not included in the SDK's hardcoded chain maps.
 *
 * This module patches the following SDK objects:
 * - ChainId enum (used for input validation)
 * - CHAINS map (used to create viem PublicClients with multicall3)
 * - NATIVE_ASSETS map (used for wethIsEth calculations)
 * - PERMIT2 map (used for permit2 token approvals)
 * - balancerV3Contracts (Vault, Router, BatchRouter addresses)
 *
 * Import this module early (side-effect import) in any file that uses SDK functions
 * with custom chains.
 */

import { CHAINS, ChainId, NATIVE_ASSETS, PERMIT2, Token, balancerV3Contracts } from '@balancer/sdk'
import { defineChain, type Address } from 'viem'
import { getNetworkConfig } from '@repo/lib/config/app.config'
import { GqlChain } from '@repo/lib/shared/services/api/generated/graphql'

const SWELLCHAIN_SEPOLIA_CHAIN_ID = 1924

// Only patch if not already patched
if (!(SWELLCHAIN_SEPOLIA_CHAIN_ID in ChainId)) {
  const config = getNetworkConfig(GqlChain.SwellchainSepolia)
  if (config) {
    // Cast SDK chain maps to allow runtime extension with custom chain IDs
    const chains = CHAINS as Record<number, unknown>
    const nativeAssets = NATIVE_ASSETS as Record<number, Token>
    const permit2 = PERMIT2 as Record<number, string>

    // 1. Patch ChainId enum (bidirectional mapping for `chainId in ChainId` checks)
    const chainIdObj = ChainId as Record<string | number, string | number>
    chainIdObj[SWELLCHAIN_SEPOLIA_CHAIN_ID] = 'SWELLCHAIN_SEPOLIA'
    chainIdObj['SWELLCHAIN_SEPOLIA'] = SWELLCHAIN_SEPOLIA_CHAIN_ID

    // 2. Patch CHAINS map (viem chain definitions for multicall3 support)
    if (!chains[SWELLCHAIN_SEPOLIA_CHAIN_ID]) {
      const chain = defineChain({
        id: SWELLCHAIN_SEPOLIA_CHAIN_ID,
        name: config.name,
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: { default: { http: ['https://rpc.ankr.com/swell_sepolia'] } },
        contracts: {
          multicall3: {
            address: config.contracts.multicall2 as Address,
          },
        },
        testnet: true,
      })
      chains[SWELLCHAIN_SEPOLIA_CHAIN_ID] = chain
    }

    // 3. Patch NATIVE_ASSETS map
    if (!nativeAssets[SWELLCHAIN_SEPOLIA_CHAIN_ID]) {
      const nativeToken = new Token(
        SWELLCHAIN_SEPOLIA_CHAIN_ID,
        config.tokens.nativeAsset.address as Address,
        18,
        'ETH',
        'Ether',
        config.tokens.addresses.wNativeAsset as Address
      )
      nativeAssets[SWELLCHAIN_SEPOLIA_CHAIN_ID] = nativeToken
    }

    // 4. Patch PERMIT2 map
    if (!permit2[SWELLCHAIN_SEPOLIA_CHAIN_ID]) {
      permit2[SWELLCHAIN_SEPOLIA_CHAIN_ID] = config.contracts.permit2 as string
    }

    // 5. Patch balancerV3Contracts maps (Vault, Router, BatchRouter)
    const contracts = balancerV3Contracts as Record<string, Record<number, string>>

    if (!contracts.Vault?.[SWELLCHAIN_SEPOLIA_CHAIN_ID]) {
      contracts.Vault = contracts.Vault || {}
      contracts.Vault[SWELLCHAIN_SEPOLIA_CHAIN_ID] = config.contracts.balancer.vaultV3 as string
    }

    if (!contracts.Router?.[SWELLCHAIN_SEPOLIA_CHAIN_ID]) {
      contracts.Router = contracts.Router || {}
      contracts.Router[SWELLCHAIN_SEPOLIA_CHAIN_ID] = config.contracts.balancer.router as string
    }

    if (!contracts.BatchRouter?.[SWELLCHAIN_SEPOLIA_CHAIN_ID]) {
      contracts.BatchRouter = contracts.BatchRouter || {}
      contracts.BatchRouter[SWELLCHAIN_SEPOLIA_CHAIN_ID] = config.contracts.balancer
        .batchRouter as string
    }
  }
}

export {} // Ensure this is treated as a module
