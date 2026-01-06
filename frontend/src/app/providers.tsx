'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { injected, metaMask } from 'wagmi/connectors'
import { ReactNode, useState } from 'react'

// Define Rootstock Testnet chain
const rootstockTestnet = defineChain({
  id: 31,
  name: 'Rootstock Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://public-node.testnet.rsk.co'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Rootstock Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
  },
})

// Define Rootstock Mainnet chain
const rootstock = defineChain({
  id: 30,
  name: 'Rootstock Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://public-node.rsk.co'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Rootstock Explorer',
      url: 'https://explorer.rsk.co',
    },
  },
})

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID 
  ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) 
  : 31 // Rootstock Testnet

const selectedChain = chainId === 30 ? rootstock : rootstockTestnet
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 
  (chainId === 30 ? 'https://public-node.rsk.co' : 'https://public-node.testnet.rsk.co')

const config = createConfig({
  chains: [selectedChain],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [selectedChain.id]: http(rpcUrl),
  } as Record<number, ReturnType<typeof http>>,
})

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
