'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { MULTISIG_ABI, normalizeTransaction } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { TransactionItem } from './TransactionItem'
import { FaSearch } from 'react-icons/fa'
import { useIsMounted } from '@/hooks/useIsMounted'

const PAGE_SIZE = 50

export function TxListSimple() {
  const isMounted = useIsMounted()
  const { multisigAddress } = useMultisig()

  const { address, isConnected } = useAccount()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'executed'>('all')
  const [page, setPage] = useState(1)

  const { data: txCount } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getTransactionCount',
    query: {
      enabled: isMounted,
    },
  })

  const { data: ownerCount } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getOwnerCount',
    query: {
      enabled: isMounted,
    },
  })

  const { data: requiredConfirmations } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'requiredConfirmations',
    query: {
      enabled: isMounted,
    },
  })

  const { data: isOwner } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'isOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: isMounted && !!address,
    },
  })

  // Calculate txCountNum - must be before early returns (Rules of Hooks)
  const txCountNum = isMounted && txCount ? Number(txCount) : 0
  const totalPages = Math.max(1, Math.ceil(txCountNum / PAGE_SIZE))
  const pageStart = (page - 1) * PAGE_SIZE

  const { data: txIdsRaw } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getTransactionIds',
    args: [BigInt(pageStart), BigInt(PAGE_SIZE)],
    query: {
      enabled: isMounted && !!multisigAddress && txCountNum > 0,
    },
  })

  const pageTxIds = useMemo(() => {
    if (!txIdsRaw || !Array.isArray(txIdsRaw)) return []
    return txIdsRaw.map((id) => Number(id))
  }, [txIdsRaw])

  useEffect(() => {
    setPage(1)
  }, [multisigAddress, txCountNum])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  // Early returns AFTER all hooks are called
  if (!isMounted) {
    return (
      <div className="bg-rootstock-card p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-rootstock-muted rounded w-32 mb-4"></div>
          <div className="h-10 bg-rootstock-muted rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-20 bg-rootstock-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-rootstock-card p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Transactions</h2>
        <p className="text-rootstock-muted">Please connect your wallet to view transactions.</p>
      </div>
    )
  }

  if (!multisigAddress) {
    return (
      <div className="bg-rootstock-card p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Transactions</h2>
        <p className="text-rootstock-muted">
          No multisig contract configured. Set <code className="text-white">NEXT_PUBLIC_MULTISIG_ADDRESS</code> in{' '}
          <code className="text-white">frontend/.env.local</code> or deploy a new multisig from the UI.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-rootstock-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Transactions</h2>
        <span className="text-sm text-rootstock-muted">
          Total: {txCountNum} | Required: {requiredConfirmations?.toString() || '0'} / {ownerCount?.toString() || '0'}
        </span>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rootstock-muted" />
          <input
            type="text"
            placeholder="Search on this page by transaction ID or recipient address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-rootstock-surface border border-rootstock rounded-lg text-white placeholder-rootstock-subtle focus:outline-none focus:ring-2 focus:ring-[var(--rootstock-orange)] focus:border-[var(--rootstock-orange)] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-rootstock-orange text-white'
                : 'bg-rootstock-muted text-rootstock-muted hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === 'pending'
                ? 'bg-rootstock-orange text-white'
                : 'bg-rootstock-muted text-rootstock-muted hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('executed')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === 'executed'
                ? 'bg-rootstock-orange text-white'
                : 'bg-rootstock-muted text-rootstock-muted hover:text-white'
            }`}
          >
            Executed
          </button>
        </div>
      </div>

      {isOwner === false && address && (
        <div className="mb-4 p-4 bg-rootstock-warning-soft border border-rootstock-orange rounded-md">
          <p className="text-rootstock-orange text-sm">
            ⚠️ You are not an owner. You can view transactions but cannot interact with them.
          </p>
        </div>
      )}

      {txCountNum === 0 ? (
        <p className="text-rootstock-muted">No transactions yet.</p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 text-sm text-rootstock-muted">
            <span>
              Page {page} of {totalPages}
              {pageTxIds.length > 0
                ? ` · IDs ${pageTxIds[0]}–${pageTxIds[pageTxIds.length - 1]} (${txCountNum} total)`
                : ' · Loading…'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded-md border border-rootstock bg-rootstock-panel text-white disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded-md border border-rootstock bg-rootstock-panel text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {pageTxIds.map((txId) => (
              <TransactionItemWrapper
                key={txId}
                txId={txId}
                requiredConfirmations={(requiredConfirmations ?? BigInt(0)) as bigint}
                isOwner={isOwner === true}
                userAddress={address}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TransactionItemWrapper({
  txId,
  requiredConfirmations,
  isOwner,
  userAddress,
  searchTerm,
  filterStatus,
}: {
  txId: number
  requiredConfirmations: bigint
  isOwner: boolean
  userAddress?: `0x${string}`
  searchTerm?: string
  filterStatus?: 'all' | 'pending' | 'executed'
}) {
  const { multisigAddress: msAddr } = useMultisig()
  const { data: tx, refetch } = useReadContract({
    address: msAddr ?? undefined,
    abi: MULTISIG_ABI,
    functionName: 'getTransaction',
    args: [BigInt(txId)],
    query: {
      enabled: !!msAddr,
      refetchInterval: 8000, // Poll every 8 seconds
    },
  })

  if (!tx || typeof tx !== 'object') {
    return (
      <div
        className="p-4 border border-rootstock rounded-lg bg-rootstock-panel text-rootstock-muted"
        role="status"
        aria-live="polite"
      >
        Loading transaction #{txId}...
      </div>
    )
  }

  const safeTx = normalizeTransaction(tx)

  // Apply filters
  if (filterStatus === 'pending' && safeTx.executed) return null
  if (filterStatus === 'executed' && !safeTx.executed) return null
  
  // Apply search
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
    const matchesId = txId.toString().includes(searchLower)
    const matchesAddress = safeTx.to.toLowerCase().includes(searchLower)
    if (!matchesId && !matchesAddress) return null
  }

  return (
    <TransactionItem
      txId={txId}
      tx={safeTx}
      requiredConfirmations={requiredConfirmations}
      isOwner={isOwner}
      userAddress={userAddress}
      onTransactionUpdate={refetch}
    />
  )
}
