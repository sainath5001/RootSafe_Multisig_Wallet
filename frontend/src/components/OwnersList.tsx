'use client'

import { useIsMounted } from '@/hooks/useIsMounted'
import { useReadContract, useAccount } from 'wagmi'
import { MULTISIG_ABI } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { truncateAddress, getExplorerAddressUrl } from '@/lib/utils'
import Link from 'next/link'
import { FaUser, FaCheckCircle, FaCopy } from 'react-icons/fa'
import toast from 'react-hot-toast'

export function OwnersList() {
  const isMounted = useIsMounted()

  const { address: userAddress } = useAccount()
  const { multisigAddress } = useMultisig()

  // Get owner count
  const { data: ownerCount } = useReadContract({
    address: isMounted && multisigAddress ? multisigAddress : undefined,
    abi: MULTISIG_ABI,
    functionName: 'getOwnerCount',
    query: {
      enabled: isMounted,
    },
  })

  const ownerCountNum = ownerCount ? Number(ownerCount) : 0

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success('Address copied!'))
        .catch(() => toast.error('Copy failed'))
    }
  }

  if (!isMounted) {
    return (
      <div className="bg-rootstock-card p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-rootstock-muted rounded w-32 mb-4"></div>
          <div className="space-y-2">
            <div className="h-12 bg-rootstock-muted rounded"></div>
            <div className="h-12 bg-rootstock-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!multisigAddress) {
    return (
      <div className="bg-rootstock-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaUser className="text-rootstock-orange" />
          Owners
        </h2>
        <p className="mt-2 text-rootstock-muted">
          No multisig contract configured. Set <code className="text-white">NEXT_PUBLIC_MULTISIG_ADDRESS</code> in{' '}
          <code className="text-white">frontend/.env.local</code> or deploy a new multisig from the UI.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-rootstock-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaUser className="text-rootstock-orange" />
          Owners ({ownerCountNum})
        </h2>
      </div>
      {ownerCountNum === 0 ? (
        <p className="text-rootstock-muted">No owners found.</p>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: ownerCountNum }).map((_, index) => (
            <OwnerItem
              key={index}
              index={index}
              multisigAddress={multisigAddress}
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
  multisigAddress,
  userAddress,
  onCopy,
}: {
  index: number
  multisigAddress: `0x${string}`
  userAddress?: `0x${string}`
  onCopy: (text: string) => void
}) {
  const { data: ownerAddress } = useReadContract({
    address: multisigAddress,
    abi: MULTISIG_ABI,
    functionName: 'owners',
    args: [BigInt(index)],
  })

  if (!ownerAddress || typeof ownerAddress !== 'string') {
    return (
      <div className="p-3 border border-rootstock rounded-lg bg-rootstock-panel animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--rootstock-gray)]"></div>
          <div className="flex-1">
            <div className="h-4 bg-[var(--rootstock-gray)] rounded w-32 mb-2"></div>
            <div className="h-3 bg-[var(--rootstock-gray)] rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  const ownerAddr = ownerAddress as `0x${string}`
  const isCurrentUser = userAddress?.toLowerCase() === ownerAddr.toLowerCase()

  return (
    <div
      className={`p-4 border rounded-lg transition-all hover:border-[var(--rootstock-orange)] ${
        isCurrentUser ? 'bg-rootstock-warning border-[var(--rootstock-orange)]' : 'bg-rootstock-panel border-rootstock'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rootstock-orange flex items-center justify-center text-sm font-semibold text-white">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-white">
                <Link
                  href={getExplorerAddressUrl(ownerAddr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rootstock-orange hover:underline transition-colors"
                >
                  {truncateAddress(ownerAddr)}
                </Link>
              </p>
              <button
                onClick={() => onCopy(ownerAddr)}
                className="text-rootstock-muted hover:text-rootstock-orange transition-colors"
                title="Copy address"
                aria-label="Copy owner address"
              >
                <FaCopy className="text-xs" />
              </button>
            </div>
            {isCurrentUser && (
              <div className="flex items-center gap-1 mt-1">
                <FaCheckCircle className="text-rootstock-orange text-xs" />
                <p className="text-xs text-rootstock-orange font-semibold">You (Current User)</p>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-rootstock-muted">Owner #{index + 1}</p>
        </div>
      </div>
    </div>
  )
}

