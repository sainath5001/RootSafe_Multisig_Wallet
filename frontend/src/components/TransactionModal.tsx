'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { MULTISIG_ABI, normalizeTransaction } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { formatRBTC, truncateAddress, getExplorerAddressUrl } from '@/lib/utils'
import { FaTimes, FaCopy, FaExternalLinkAlt, FaCheckCircle, FaClock } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface TransactionModalProps {
  txId: number
  isOpen: boolean
  onClose: () => void
}

export function TransactionModal({ txId, isOpen, onClose }: TransactionModalProps) {
  const { multisigAddress } = useMultisig()
  const { data: tx } = useReadContract({
    address: multisigAddress ?? undefined,
    abi: MULTISIG_ABI,
    functionName: 'getTransaction',
    args: [BigInt(txId)],
  })

  const { data: ownerCount } = useReadContract({
    address: multisigAddress ?? undefined,
    abi: MULTISIG_ABI,
    functionName: 'getOwnerCount',
  })

  const { data: requiredConfirmations } = useReadContract({
    address: multisigAddress ?? undefined,
    abi: MULTISIG_ABI,
    functionName: 'requiredConfirmations',
  })

  // Note: owner-by-owner confirmation display is not implemented yet.

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Copy failed')
    }
  }

  if (!isOpen || !tx) return null
  const safeTx = normalizeTransaction(tx)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Transaction #{txId} Details</h2>
          <button
            onClick={onClose}
            className="text-[#a0a0a0] hover:text-white transition-colors"
            aria-label="Close transaction details"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <h3 className="text-sm text-[#a0a0a0] mb-2">Status</h3>
            <div className="flex items-center gap-2">
              {safeTx.executed ? (
                <>
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-green-400 font-semibold">Executed</span>
                </>
              ) : (
                <>
                  <FaClock className="text-[#FF6600]" />
                  <span className="text-[#FF6600] font-semibold">Pending</span>
                </>
              )}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <h3 className="text-sm text-[#a0a0a0] mb-2">Recipient Address</h3>
            <div className="flex items-center gap-2">
              <code className="text-white font-mono text-sm break-all">{safeTx.to}</code>
              <button
                onClick={() => copyToClipboard(safeTx.to)}
                className="text-[#FF6600] hover:text-[#FF8533] transition-colors"
                aria-label="Copy recipient address"
              >
                <FaCopy />
              </button>
              <Link
                href={getExplorerAddressUrl(safeTx.to)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6600] hover:text-[#FF8533] transition-colors"
              >
                <FaExternalLinkAlt />
              </Link>
            </div>
          </div>

          {/* Amount */}
          <div>
            <h3 className="text-sm text-[#a0a0a0] mb-2">Amount</h3>
            <p className="text-white text-xl font-semibold">
              {formatRBTC(safeTx.value)} RBTC
            </p>
          </div>

          {/* Confirmations */}
          <div>
            <h3 className="text-sm text-[#a0a0a0] mb-2">
              Confirmations: {safeTx.numConfirmations.toString()} / {requiredConfirmations?.toString() || '0'}
            </h3>
            <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF6600] transition-all"
                style={{
                  width: `${Math.min((Number(safeTx.numConfirmations) / Number(requiredConfirmations || 1)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Transaction Data */}
          <div>
            <h3 className="text-sm text-[#a0a0a0] mb-2">Transaction Data</h3>
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded p-3">
              <code className="text-[#a0a0a0] text-xs break-all">
                {safeTx.data === '0x' || safeTx.data.length <= 2 ? 'No data (simple transfer)' : safeTx.data}
              </code>
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <h3 className="text-sm text-[#a0a0a0] mb-2">Transaction ID</h3>
            <div className="flex items-center gap-2">
              <code className="text-white font-mono text-sm">{txId}</code>
              <button
                onClick={() => copyToClipboard(txId.toString())}
                className="text-[#FF6600] hover:text-[#FF8533] transition-colors"
                aria-label="Copy transaction id"
              >
                <FaCopy />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}














