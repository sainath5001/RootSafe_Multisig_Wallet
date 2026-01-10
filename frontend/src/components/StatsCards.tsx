'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useBalance } from 'wagmi'
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '@/lib/contract'
import { formatRBTC } from '@/lib/utils'
import { FaWallet, FaUsers, FaCheckCircle, FaFileContract } from 'react-icons/fa'

export function StatsCards() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: ownerCount } = useReadContract({
    address: isMounted ? MULTISIG_ADDRESS : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getOwnerCount',
    query: {
      enabled: isMounted,
      retry: 1,
      retryDelay: 1000,
    },
  })

  const { data: requiredConfirmations } = useReadContract({
    address: isMounted ? MULTISIG_ADDRESS : undefined,
    abi: MULTISIG_ABI,
    functionName: 'requiredConfirmations',
    query: {
      enabled: isMounted,
      retry: 1,
      retryDelay: 1000,
    },
  })

  const { data: txCount } = useReadContract({
    address: isMounted ? MULTISIG_ADDRESS : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getTransactionCount',
    query: {
      enabled: isMounted,
      retry: 1,
      retryDelay: 1000,
    },
  })

  const { data: balance } = useBalance({
    address: isMounted ? MULTISIG_ADDRESS : undefined,
    query: {
      enabled: isMounted,
      retry: 1,
      retryDelay: 1000,
    },
  })

  const stats = [
    {
      label: 'Contract Balance',
      value: balance?.value !== undefined ? formatRBTC(balance.value) : '0',
      unit: 'RBTC',
      icon: FaWallet,
      color: 'text-[#FF6600]',
    },
    {
      label: 'Total Owners',
      value: ownerCount?.toString() || '0',
      unit: '',
      icon: FaUsers,
      color: 'text-blue-400',
    },
    {
      label: 'Required Confirmations',
      value: requiredConfirmations?.toString() || '0',
      unit: `/${ownerCount?.toString() || '0'}`,
      icon: FaCheckCircle,
      color: 'text-green-400',
    },
    {
      label: 'Total Transactions',
      value: txCount?.toString() || '0',
      unit: '',
      icon: FaFileContract,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-12 relative z-10">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#FF6600] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6600]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-2xl`}>
                <Icon />
              </div>
            </div>
            <div>
              <p className="text-[#a0a0a0] text-sm mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-bold">
                {stat.value}
                {stat.unit && <span className="text-[#a0a0a0] text-lg ml-1">{stat.unit}</span>}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}






