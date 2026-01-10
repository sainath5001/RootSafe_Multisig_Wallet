'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '@/lib/contract'
import { truncateAddress, getExplorerAddressUrl } from '@/lib/utils'
import Link from 'next/link'
import { FaUser, FaCheckCircle, FaCopy } from 'react-icons/fa'
import toast from 'react-hot-toast'

export function OwnersList() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { address: userAddress } = useAccount()

  // Get owner count
  const { data: ownerCount } = useReadContract({
    address: isMounted ? MULTISIG_ADDRESS : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getOwnerCount',
    query: {
      enabled: isMounted,
    },
  })

  const ownerCountNum = ownerCount ? Number(ownerCount) : 0

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.success('Address copied!')
    }
  }

  if (!isMounted) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-[#2a2a2a] rounded w-32 mb-4"></div>
          <div className="space-y-2">
            <div className="h-12 bg-[#2a2a2a] rounded"></div>
            <div className="h-12 bg-[#2a2a2a] rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaUser className="text-[#FF6600]" />
          Owners ({ownerCountNum})
        </h2>
      </div>
      {ownerCountNum === 0 ? (
        <p className="text-[#a0a0a0]">No owners found.</p>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: ownerCountNum }).map((_, index) => (
            <OwnerItem 
              key={index} 
              index={index} 
              userAddress={userAddress}
              onCopy={copyToClipboard}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function OwnerItem({ 
  index, 
  userAddress,
  onCopy 
}: { 
  index: number
  userAddress?: `0x${string}`
  onCopy: (text: string) => void
}) {
  const { data: ownerAddress } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'owners',
    args: [BigInt(index)],
  })

  if (!ownerAddress || typeof ownerAddress !== 'string') {
    return (
      <div className="p-3 border border-[#2a2a2a] rounded-lg bg-[#1a1a1a] animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2a2a2a]"></div>
          <div className="flex-1">
            <div className="h-4 bg-[#2a2a2a] rounded w-32 mb-2"></div>
            <div className="h-3 bg-[#2a2a2a] rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  const ownerAddr = ownerAddress as `0x${string}`
  const isCurrentUser = userAddress?.toLowerCase() === ownerAddr.toLowerCase()

  return (
    <div
      className={`p-4 border rounded-lg transition-all hover:border-[#FF6600] ${
        isCurrentUser ? 'bg-[#2a1a00] border-[#FF6600]' : 'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF6600] flex items-center justify-center text-sm font-semibold text-white">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-white">
                <Link
                  href={getExplorerAddressUrl(ownerAddr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6600] hover:text-[#FF8533] hover:underline transition-colors"
                >
                  {truncateAddress(ownerAddr)}
                </Link>
              </p>
              <button
                onClick={() => onCopy(ownerAddr)}
                className="text-[#a0a0a0] hover:text-[#FF6600] transition-colors"
                title="Copy address"
              >
                <FaCopy className="text-xs" />
              </button>
            </div>
            {isCurrentUser && (
              <div className="flex items-center gap-1 mt-1">
                <FaCheckCircle className="text-[#FF6600] text-xs" />
                <p className="text-xs text-[#FF6600] font-semibold">You (Current User)</p>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#a0a0a0]">Owner #{index + 1}</p>
        </div>
      </div>
    </div>
  )
}

