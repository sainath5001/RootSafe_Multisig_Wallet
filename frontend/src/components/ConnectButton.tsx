'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatRBTC } from '@/lib/utils'
import { useIsMounted } from '@/hooks/useIsMounted'

export function ConnectButton() {
  const isMounted = useIsMounted()

  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  
  // Get wallet balance
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
    query: {
      enabled: !!address && isMounted,
    },
  })

  // Prevent hydration mismatch - only render after mount
  if (!isMounted) {
    return (
      <button
        disabled
        className="px-6 py-2 bg-rootstock-muted text-white rounded-lg opacity-50 cursor-not-allowed transition-colors font-semibold"
      >
        Loading...
      </button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-semibold text-white">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <div className="text-xs text-rootstock-muted">
            {balanceLoading ? (
              'Loading...'
            ) : balance?.value !== undefined ? (
              `${formatRBTC(balance.value)} RBTC`
            ) : (
              '0 RBTC'
            )}
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-rootstock-muted text-white rounded-lg hover:bg-[var(--rootstock-gray-light)] border border-[var(--rootstock-gray-light)] transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  const metaMaskConnector = connectors.find((c) => c.id === 'metaMask' || c.id === 'injected')

  return (
    <button
      onClick={() => metaMaskConnector && connect({ connector: metaMaskConnector })}
      disabled={isPending || !metaMaskConnector}
      className="px-6 py-2 bg-rootstock-orange text-white rounded-lg hover:bg-rootstock-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
