'use client'

import { useState, useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { MULTISIG_ABI, normalizeTransaction } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { TransactionItem } from './TransactionItem'
import { FaSearch, FaFilter } from 'react-icons/fa'
import { useIsMounted } from '@/hooks/useIsMounted'

export function TxListSimple() {
  const isMounted = useIsMounted()
  const { multisigAddress, missingEnvDefault } = useMultisig()

  const { address, isConnected } = useAccount()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'executed'>('all')

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

  // Filter transactions - must be before early returns (Rules of Hooks)
  const filteredTxIds = useMemo(() => {
    if (!isMounted || !txCountNum) return []
    const allIds = Array.from({ length: txCountNum }, (_, i) => i)
    if (filterStatus === 'all' && !searchTerm) return allIds
    return allIds.filter((id) => {
      // We'll filter in the wrapper component based on actual tx data
      return true
    })
  }, [isMounted, txCountNum, filterStatus, searchTerm])

  // Early returns AFTER all hooks are called
  if (!isMounted) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-[#2a2a2a] rounded w-32 mb-4"></div>
          <div className="h-10 bg-[#2a2a2a] rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-20 bg-[#2a2a2a] rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Transactions</h2>
        <p className="text-[#a0a0a0]">Please connect your wallet to view transactions.</p>
      </div>
    )
  }

  if (!multisigAddress) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Transactions</h2>
        <p className="text-[#a0a0a0]">
          No multisig contract configured. Set <code className="text-white">NEXT_PUBLIC_MULTISIG_ADDRESS</code> in{' '}
          <code className="text-white">frontend/.env.local</code> or deploy a new multisig from the UI.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Transactions</h2>
        <span className="text-sm text-[#a0a0a0]">
          Total: {txCountNum} | Required: {requiredConfirmations?.toString() || '0'} / {ownerCount?.toString() || '0'}
        </span>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0a0a0]" />
          <input
            type="text"
            placeholder="Search by transaction ID or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black border border-[#2a2a2a] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#FF6600] text-white'
                : 'bg-[#2a2a2a] text-[#a0a0a0] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === 'pending'
                ? 'bg-[#FF6600] text-white'
                : 'bg-[#2a2a2a] text-[#a0a0a0] hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('executed')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === 'executed'
                ? 'bg-[#FF6600] text-white'
                : 'bg-[#2a2a2a] text-[#a0a0a0] hover:text-white'
            }`}
          >
            Executed
          </button>
        </div>
      </div>

      {isOwner === false && address && (
        <div className="mb-4 p-4 bg-[#3a2a00] border border-[#FF6600] rounded-md">
          <p className="text-[#FF8533] text-sm">
            ⚠️ You are not an owner. You can view transactions but cannot interact with them.
          </p>
        </div>
      )}

      {txCountNum === 0 ? (
        <p className="text-[#a0a0a0]">No transactions yet.</p>
      ) : (
        <div className="space-y-4">
          {filteredTxIds.map((txId) => (
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
    return <div className="p-4 border border-[#2a2a2a] rounded-lg bg-[#1a1a1a] text-[#a0a0a0]">Loading transaction #{txId}...</div>
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
