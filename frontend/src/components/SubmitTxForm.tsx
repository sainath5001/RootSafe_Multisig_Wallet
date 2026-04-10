'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { isAddress } from 'viem'
import { MULTISIG_ABI } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { parseRBTC, isValidAddress, isValidHex } from '@/lib/utils'

export function SubmitTxForm() {
  const { address, isConnected } = useAccount()
  const { multisigAddress } = useMultisig()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [data, setData] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    
    if (!isConnected || !address) {
      setValidationError('Please connect your wallet first')
      return
    }
    if (!multisigAddress) {
      setValidationError('No multisig contract configured. Set NEXT_PUBLIC_MULTISIG_ADDRESS or deploy a new multisig.')
      return
    }

    // Validate recipient address
    if (!recipient.trim()) {
      setValidationError('Recipient address is required')
      return
    }

    if (!isValidAddress(recipient)) {
      setValidationError('Invalid recipient address. Please enter a valid Ethereum address.')
      return
    }

    // Validate hex data if provided
    if (data.trim() && !isValidHex(data)) {
      setValidationError('Invalid hex data. Data must be a valid hexadecimal string (e.g., 0x1234abcd)')
      return
    }

    try {
      const value = parseRBTC(amount)
      
      // Safely convert data to hex string
      let txData: `0x${string}` = '0x'
      if (data.trim()) {
        const cleanedData = data.trim().startsWith('0x') ? data.trim().slice(2) : data.trim()
        // Validate hex characters
        if (!/^[0-9a-fA-F]+$/.test(cleanedData)) {
          setValidationError('Invalid hex data format')
          return
        }
        txData = `0x${cleanedData}` as `0x${string}`
      }

      // Validate recipient is a valid address type
      if (!isAddress(recipient)) {
        setValidationError('Invalid recipient address format')
        return
      }

      writeContract({
        address: multisigAddress,
        abi: MULTISIG_ABI,
        functionName: 'submitTransaction',
        args: [recipient as `0x${string}`, value, txData],
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error submitting transaction'
      setValidationError(errorMessage)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-rootstock-card p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Submit Transaction</h2>
        <p className="text-rootstock-muted">Please connect your wallet to submit transactions.</p>
      </div>
    )
  }

  return (
    <div className="bg-rootstock-card p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Submit Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="submitTxRecipient" className="block text-sm font-medium text-rootstock-muted mb-1">
            Recipient Address
          </label>
          <input
            id="submitTxRecipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            required
            className="w-full px-3 py-2 bg-rootstock-surface border border-rootstock rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--rootstock-orange)] focus:border-[var(--rootstock-orange)] text-white placeholder-rootstock-subtle transition-colors"
          />
        </div>
        <div>
          <label htmlFor="submitTxAmount" className="block text-sm font-medium text-rootstock-muted mb-1">
            Amount (RBTC)
          </label>
          <input
            id="submitTxAmount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            required
            step="any"
            className="w-full px-3 py-2 bg-rootstock-surface border border-rootstock rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--rootstock-orange)] focus:border-[var(--rootstock-orange)] text-white placeholder-rootstock-subtle transition-colors"
          />
        </div>
        <div>
          <label htmlFor="submitTxData" className="block text-sm font-medium text-rootstock-muted mb-1">
            Data (Optional - Hex string)
          </label>
          <input
            id="submitTxData"
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="0x (leave empty for simple transfer)"
            className="w-full px-3 py-2 bg-rootstock-surface border border-rootstock rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--rootstock-orange)] focus:border-[var(--rootstock-orange)] text-white placeholder-rootstock-subtle transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full px-4 py-2 bg-rootstock-orange text-white rounded-lg hover:bg-rootstock-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isPending ? 'Waiting for approval...' : isConfirming ? 'Submitting...' : 'Submit Transaction'}
        </button>
        {isConfirmed && (
          <p className="text-green-400 text-sm" role="status" aria-live="polite">
            Transaction submitted successfully!
          </p>
        )}
        {validationError && (
          <p className="text-red-400 text-sm">
            {validationError}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm">
            Error: {error.message}
          </p>
        )}
        {hash && (
          <p className="text-rootstock-orange text-sm break-all">
            Tx Hash: {hash}
          </p>
        )}
      </form>
    </div>
  )
}


