'use client'

import { useEffect } from 'react'
import { useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { MULTISIG_ABI, Transaction } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { formatRBTC, truncateAddress, formatUserFacingWalletError } from '@/lib/utils'
import { FaCheckCircle, FaTimesCircle, FaClock, FaCopy, FaInfoCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { TransactionModal } from './TransactionModal'
import { useState } from 'react'

export interface TransactionItemProps {
  txId: number
  tx: Transaction
  requiredConfirmations: bigint
  isOwner: boolean
  userAddress?: `0x${string}`
  onTransactionUpdate?: () => void
}

export function TransactionItem({ txId, tx, requiredConfirmations, isOwner, userAddress, onTransactionUpdate }: TransactionItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { multisigAddress } = useMultisig()
  const { data: contractBalance } = useBalance({ address: multisigAddress ?? undefined })

  // Check if user has confirmed this transaction
  const { data: isConfirmed, refetch: refetchIsConfirmed } = useReadContract({
    address: multisigAddress ?? undefined,
    abi: MULTISIG_ABI,
    functionName: 'isConfirmed',
    args: [BigInt(txId), userAddress!],
    query: {
      enabled: !!userAddress && !!multisigAddress,
      refetchInterval: 8000, // Poll every 8 seconds
    },
  })

  const { writeContract: writeConfirm, data: confirmHash } = useWriteContract()
  const { writeContract: writeRevoke, data: revokeHash } = useWriteContract()
  const { writeContract: writeExecute, data: executeHash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmSuccess, error: confirmError } =
    useWaitForTransactionReceipt({ hash: confirmHash })
  const { isLoading: isRevoking, isSuccess: isRevokeSuccess, error: revokeError } =
    useWaitForTransactionReceipt({ hash: revokeHash })
  const { isLoading: isExecuting, isSuccess: isExecuteSuccess, error: executeError } =
    useWaitForTransactionReceipt({ hash: executeHash })

  // Refetch transaction data when confirmation/revocation/execution completes
  useEffect(() => {
    if (isConfirmSuccess) {
      toast.success('Transaction confirmed successfully!')
      setTimeout(() => {
        refetchIsConfirmed()
        onTransactionUpdate?.()
      }, 1000)
    }
    if (isRevokeSuccess) {
      toast.success('Confirmation revoked successfully!')
      setTimeout(() => {
        refetchIsConfirmed()
        onTransactionUpdate?.()
      }, 1000)
    }
    if (isExecuteSuccess) {
      toast.success('Transaction executed successfully!')
      setTimeout(() => {
        refetchIsConfirmed()
        onTransactionUpdate?.()
      }, 1000)
    }
    // If a tx reverts, wagmi surfaces the revert reason via `error`.
    if (confirmError) {
      toast.error(formatUserFacingWalletError(confirmError, 'Approval'))
    }
    if (revokeError) {
      toast.error(formatUserFacingWalletError(revokeError, 'Revoke'))
    }
    if (executeError) {
      toast.error(formatUserFacingWalletError(executeError, 'Execute'))
    }
  }, [
    isConfirmSuccess,
    isRevokeSuccess,
    isExecuteSuccess,
    confirmError,
    revokeError,
    executeError,
    refetchIsConfirmed,
    onTransactionUpdate,
  ])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Copy failed')
    }
  }

  const handleConfirm = () => {
    if (!multisigAddress) {
      toast.error('No multisig contract configured.')
      return
    }
    if (!isOwner) {
      toast.error('Only owners can approve transactions.')
      return
    }
    if (confirmed) {
      toast.error('You already approved this transaction.')
      return
    }
    try {
      writeConfirm({
        address: multisigAddress,
        abi: MULTISIG_ABI,
        functionName: 'confirmTransaction',
        args: [BigInt(txId)],
      })
    } catch (e: unknown) {
      toast.error(formatUserFacingWalletError(e, 'Approval'))
    }
  }

  const handleRevoke = () => {
    if (!multisigAddress) {
      toast.error('No multisig contract configured.')
      return
    }
    writeRevoke({
      address: multisigAddress,
      abi: MULTISIG_ABI,
      functionName: 'revokeConfirmation',
      args: [BigInt(txId)],
    })
  }

  const handleExecute = () => {
    if (!multisigAddress) {
      toast.error('No multisig contract configured.')
      return
    }
    if (!canExecute) {
      const bal = contractBalance?.value
      if (bal !== undefined && bal < tx.value) {
        toast.error(
          `Execute blocked: contract balance (${formatRBTC(bal)} RBTC) < tx value (${formatRBTC(tx.value)} RBTC).`
        )
        return
      }
      toast.error('Execute blocked: confirmations/threshold not met yet.')
      return
    }
    writeExecute({
      address: multisigAddress,
      abi: MULTISIG_ABI,
      functionName: 'executeTransaction',
      args: [BigInt(txId)],
    })
  }

  const numConfirmations = tx.numConfirmations ?? 0n
  // If `requiredConfirmations` hasn't loaded yet, we currently pass `0n` as a fallback.
  // In that state, the contract will revert with insufficient confirmations, so we block execution.
  const contractBalanceWei = contractBalance?.value
  const canExecute =
    !tx.executed &&
    requiredConfirmations > 0n &&
    numConfirmations >= requiredConfirmations &&
    contractBalanceWei !== undefined &&
    contractBalanceWei >= tx.value
  const confirmed = isConfirmed === true

  return (
    <>
      <button
        type="button"
        className={`w-full text-left p-4 border rounded-lg transition-all hover:border-[var(--rootstock-orange)] cursor-pointer ${
          tx.executed ? 'bg-rootstock-success-soft border-rootstock-success' : 'bg-rootstock-panel border-rootstock'
        }`}
        onClick={() => setIsModalOpen(true)}
        aria-label={`Open details for transaction ${txId}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">Transaction #{txId}</p>
            <FaInfoCircle className="text-rootstock-orange text-xs" />
          </div>
          <p className="text-sm text-rootstock-muted">
            To: {truncateAddress(tx.to)}
          </p>
          <p className="text-sm text-rootstock-orange font-semibold">
            Amount: {formatRBTC(tx.value)} RBTC
          </p>
        </div>
        <div className="text-right flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${tx.executed
              ? 'bg-rootstock-success text-white'
              : 'bg-rootstock-orange text-white'
              }`}
          >
            {tx.executed ? (
              <>
                <FaCheckCircle /> Executed
              </>
            ) : (
              <>
                <FaClock /> Pending
              </>
            )}
          </span>
        </div>
      </button>

      <div className="mt-2 mb-3">
        <p className="text-sm text-rootstock-muted">
          Confirmations: {(tx.numConfirmations ?? 0n).toString()} / {requiredConfirmations.toString()}
        </p>
        <div className="mt-1 h-2 bg-[var(--rootstock-gray)] rounded-full overflow-hidden">
          <div
            className="h-full bg-rootstock-orange transition-all"
            style={{
              width: `${Math.min((Number(tx.numConfirmations ?? 0n) / Number(requiredConfirmations)) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {isOwner && !tx.executed && (
        <div className="flex gap-2 mt-3">
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={isConfirming || confirmed}
              className="px-4 py-2 bg-rootstock-orange text-white text-sm rounded hover:bg-rootstock-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
            >
              <FaCheckCircle />
              {isConfirming ? 'Confirming...' : 'Approve'}
            </button>
          ) : (
            <button
              onClick={handleRevoke}
              disabled={isRevoking}
              className="px-4 py-2 bg-rootstock-muted text-white text-sm rounded hover:bg-[var(--rootstock-gray-light)] border border-[var(--rootstock-gray-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
            >
              <FaTimesCircle />
              {isRevoking ? 'Revoking...' : 'Revoke'}
            </button>
          )}
          {canExecute && (
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-4 py-2 bg-rootstock-success text-white text-sm rounded hover:bg-rootstock-success-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
            >
              <FaCheckCircle />
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
          )}
        </div>
      )}

      <div className="mt-3 space-y-1">
        {confirmHash && (
          <div className="flex items-center gap-2 text-xs text-rootstock-orange">
            <span>Confirm Tx:</span>
            <code className="break-all">{confirmHash}</code>
            <button
              onClick={() => copyToClipboard(confirmHash)}
              className="text-rootstock-orange hover:underline transition-colors"
              aria-label="Copy approve transaction hash"
            >
              <FaCopy />
            </button>
          </div>
        )}
        {revokeHash && (
          <div className="flex items-center gap-2 text-xs text-rootstock-orange">
            <span>Revoke Tx:</span>
            <code className="break-all">{revokeHash}</code>
            <button
              onClick={() => copyToClipboard(revokeHash)}
              className="text-rootstock-orange hover:underline transition-colors"
              aria-label="Copy revoke transaction hash"
            >
              <FaCopy />
            </button>
          </div>
        )}
        {executeHash && (
          <div className="flex items-center gap-2 text-xs text-rootstock-success">
            <span>Execute Tx:</span>
            <code className="break-all">{executeHash}</code>
            <button
              onClick={() => copyToClipboard(executeHash)}
              className="text-rootstock-success hover:text-rootstock-success-light transition-colors"
              aria-label="Copy execute transaction hash"
            >
              <FaCopy />
            </button>
          </div>
        )}
      </div>
      <TransactionModal txId={txId} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
