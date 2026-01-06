'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useBalance } from 'wagmi'
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '@/lib/contract'
import { formatRBTC } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { FaChartLine, FaChartBar } from 'react-icons/fa'

// Dynamically import charts to avoid SSR issues
const ChartSection = dynamic(() => import('./ChartSection'), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg animate-pulse"></div>
})

export function WalletDashboard() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: txCount } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'getTransactionCount',
  })

  const { data: ownerCount } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'getOwnerCount',
  })

  const { data: requiredConfirmations } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'requiredConfirmations',
  })

  const { data: balance } = useBalance({
    address: MULTISIG_ADDRESS,
  })

  // Mock data for charts (in production, you'd fetch real historical data)
  const transactionHistory = [
    { day: 'Day 1', transactions: 2, confirmations: 4 },
    { day: 'Day 2', transactions: 5, confirmations: 8 },
    { day: 'Day 3', transactions: 3, confirmations: 6 },
    { day: 'Day 4', transactions: 7, confirmations: 12 },
    { day: 'Day 5', transactions: 4, confirmations: 8 },
    { day: 'Day 6', transactions: 6, confirmations: 10 },
    { day: 'Day 7', transactions: 8, confirmations: 14 },
  ]

  const confirmationRate = [
    { status: 'Pending', count: Number(txCount || 0) - (Number(txCount || 0) * 0.7) },
    { status: 'Executed', count: Number(txCount || 0) * 0.7 },
  ]

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-[#2a2a2a] rounded w-24 mb-2"></div>
            <div className="h-8 bg-[#2a2a2a] rounded w-16"></div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-[#2a2a2a] rounded w-24 mb-2"></div>
            <div className="h-8 bg-[#2a2a2a] rounded w-16"></div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-[#2a2a2a] rounded w-24 mb-2"></div>
            <div className="h-8 bg-[#2a2a2a] rounded w-16"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
          <h3 className="text-sm text-[#a0a0a0] mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-white">{txCount?.toString() || '0'}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
          <h3 className="text-sm text-[#a0a0a0] mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold text-[#FF6600]">
            {balance?.value !== undefined ? formatRBTC(balance.value) : '0'} RBTC
          </p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
          <h3 className="text-sm text-[#a0a0a0] mb-2">Confirmation Rate</h3>
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

