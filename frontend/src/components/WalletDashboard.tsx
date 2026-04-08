'use client'

import { useMemo } from 'react'
import { useReadContract, useBalance } from 'wagmi'
import { MULTISIG_ABI } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { formatRBTC } from '@/lib/utils'
import ChartSection from './ChartSection'
import { useIsMounted } from '@/hooks/useIsMounted'

export function WalletDashboard() {
  const isMounted = useIsMounted()
  const { multisigAddress } = useMultisig()

  const { data: txCount, error: txCountError } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getTransactionCount',
    query: {
      enabled: isMounted, // Only fetch when mounted (client-side)
      retry: 1,
      retryDelay: 1000,
    },
  })

  const { data: ownerCount, error: ownerCountError } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getOwnerCount',
    query: {
      enabled: isMounted, // Only fetch when mounted (client-side)
      retry: 1,
      retryDelay: 1000,
    },
  })

  const { data: requiredConfirmations, error: requiredConfirmationsError } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'requiredConfirmations',
    query: {
      enabled: isMounted, // Only fetch when mounted (client-side)
      retry: 1,
      retryDelay: 1000,
    },
  })

  const { data: balance, error: balanceError } = useBalance({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    query: {
      enabled: isMounted, // Only fetch when mounted (client-side)
      retry: 1,
      retryDelay: 1000,
      refetchInterval: 8000,
    },
  })

  const readError = txCountError || ownerCountError || requiredConfirmationsError || balanceError

  // Calculate real transaction statistics
  // Note: Fetching all transactions for detailed charts would be expensive.
  // For production, consider using an indexer or backend API to aggregate historical data.
  const txCountNum = txCount ? Number(txCount) : 0
  
  const { transactionHistory, confirmationRate } = useMemo(() => {
    // For now, we'll calculate based on txCount since fetching all transactions
    // could be expensive. In a production app, you'd use an indexer or backend API.
    const totalTxs = txCountNum
    const executedTxs = 0 // Would need to fetch all transactions to calculate accurately
    
    // Since we can't efficiently fetch all transactions for charts,
    // we'll show a simplified view based on available data
    const transactionHistory = totalTxs > 0 ? [
      { day: 'Total', transactions: totalTxs, confirmations: Number(requiredConfirmations || 0) * totalTxs },
    ] : []

    const pendingCount = totalTxs - executedTxs
    const confirmationRate = totalTxs > 0 ? [
      { status: 'Pending', count: pendingCount },
      { status: 'Executed', count: executedTxs },
    ] : [
      { status: 'Pending', count: 0 },
      { status: 'Executed', count: 0 },
    ]

    return { transactionHistory, confirmationRate }
  }, [txCountNum, requiredConfirmations])

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-rootstock-card p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-rootstock-muted rounded w-24 mb-2"></div>
            <div className="h-8 bg-rootstock-muted rounded w-16"></div>
          </div>
          <div className="bg-rootstock-card p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-rootstock-muted rounded w-24 mb-2"></div>
            <div className="h-8 bg-rootstock-muted rounded w-16"></div>
          </div>
          <div className="bg-rootstock-card p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-rootstock-muted rounded w-24 mb-2"></div>
            <div className="h-8 bg-rootstock-muted rounded w-16"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {readError && (
        <div className="bg-rootstock-warning border border-rootstock-orange p-4 rounded-lg">
          <p className="text-sm text-white font-semibold mb-1">Network / RPC error</p>
          <p className="text-xs text-rootstock-muted break-words">
            {(readError as Error).message || 'Failed to read contract data. Check RPC / chain and refresh.'}
          </p>
        </div>
      )}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rootstock-card p-6 rounded-lg">
          <h3 className="text-sm text-rootstock-muted mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-white">{txCount?.toString() || '0'}</p>
        </div>
        <div className="bg-rootstock-card p-6 rounded-lg">
          <h3 className="text-sm text-rootstock-muted mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold text-rootstock-orange">
            {balance?.value !== undefined ? formatRBTC(balance.value) : '0'} RBTC
          </p>
        </div>
        <div className="bg-rootstock-card p-6 rounded-lg">
          <h3 className="text-sm text-rootstock-muted mb-2">Confirmation Rate</h3>
          <p className="text-3xl font-bold text-green-400">
            {requiredConfirmations && ownerCount
              ? `${Math.round((Number(requiredConfirmations) / Number(ownerCount)) * 100)}%`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <ChartSection 
        transactionHistory={transactionHistory}
        confirmationRate={confirmationRate}
      />
    </div>
  )
}

