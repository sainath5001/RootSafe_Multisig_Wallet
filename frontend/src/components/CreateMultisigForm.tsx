'use client'

import { useEffect, useState } from 'react'
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from 'wagmi'
import { getAddress, isAddress, type Address } from 'viem'
import { MULTISIG_ABI } from '@/lib/contract'
import { useMultisig } from '@/context/MultisigContext'
import { getDefaultMultisigAddress } from '@/lib/contract'
import toast from 'react-hot-toast'
import { FaPlus, FaTrash, FaCopy, FaExternalLinkAlt } from 'react-icons/fa'
import { getExplorerAddressUrl, truncateAddress } from '@/lib/utils'
import Link from 'next/link'

function parseOwners(raw: string[]): { ok: true; owners: Address[] } | { ok: false; message: string } {
  const trimmed = raw.map((s) => s.trim()).filter(Boolean)
  if (trimmed.length === 0) {
    return { ok: false, message: 'Add at least one owner address.' }
  }
  const owners: Address[] = []
  const seen = new Set<string>()
  for (const s of trimmed) {
    if (!isAddress(s)) {
      return { ok: false, message: `Invalid address: ${s.slice(0, 20)}…` }
    }
    const a = getAddress(s)
    const key = a.toLowerCase()
    if (seen.has(key)) {
      return { ok: false, message: 'Duplicate owner addresses are not allowed.' }
    }
    seen.add(key)
    owners.push(a)
  }
  return { ok: true, owners }
}

export function CreateMultisigForm() {
  const { address, isConnected } = useAccount()
  const { multisigAddress, setMultisigAddress, resetToDefaultMultisig, hydrated, missingEnvDefault } = useMultisig()
  const [ownerRows, setOwnerRows] = useState<string[]>(['', '', ''])
  const [requiredStr, setRequiredStr] = useState('2')
  const [deployBytecode, setDeployBytecode] = useState<`0x${string}` | null>(null)
  const [lastDeployed, setLastDeployed] = useState<Address | null>(null)

  const { deployContract, data: deployHash, isPending: isDeployPending, error: deployError, reset } =
    useDeployContract()
  const { isLoading: isConfirming, isSuccess: deploySuccess, data: receipt } = useWaitForTransactionReceipt({
    hash: deployHash,
  })

  useEffect(() => {
    if (!deploySuccess || !receipt?.contractAddress) return
    const deployed = receipt.contractAddress as Address
    setMultisigAddress(deployed)
    setLastDeployed(deployed)
    toast.success(`Multisig deployed at ${deployed.slice(0, 10)}…`)
    reset()
    setOwnerRows(['', '', ''])
    setRequiredStr('2')
  }, [deploySuccess, receipt?.contractAddress, setMultisigAddress, reset])

  useEffect(() => {
    if (deployError) {
      toast.error(deployError.message.slice(0, 120))
    }
  }, [deployError])

  useEffect(() => {
    // Load the (large) deploy bytecode lazily to avoid bundling it into the initial page JS.
    // Stored in `public/multisig-bytecode.json` so it is fetched as a static asset.
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch('/multisig-bytecode.json')
        if (!res.ok) throw new Error(`Failed to load bytecode (${res.status})`)
        const json = (await res.json()) as { bytecode: `0x${string}` }
        if (!cancelled) setDeployBytecode(json.bytecode)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load deploy bytecode')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const handleDeploy = () => {
    if (!deployBytecode) {
      toast.error('Deploy bytecode is not loaded yet.')
      return
    }
    const parsed = parseOwners(ownerRows)
    if (!parsed.ok) {
      toast.error(parsed.message)
      return
    }
    const owners = parsed.owners
    const m = parseInt(requiredStr, 10)
    if (Number.isNaN(m) || m < 1 || m > owners.length) {
      toast.error(`Required confirmations must be between 1 and ${owners.length}.`)
      return
    }
    deployContract({
      abi: MULTISIG_ABI,
      bytecode: deployBytecode,
      args: [owners, BigInt(m)],
    })
  }

  const addRow = () => setOwnerRows((r) => [...r, ''])
  const removeRow = (i: number) => setOwnerRows((r) => (r.length <= 1 ? r : r.filter((_, j) => j !== i)))
  const setRow = (i: number, v: string) =>
    setOwnerRows((r) => r.map((x, j) => (j === i ? v : x)))

  const defaultAddr = getDefaultMultisigAddress()
  const usingCustom =
    hydrated &&
    !!multisigAddress &&
    !!defaultAddr &&
    multisigAddress.toLowerCase() !== defaultAddr.toLowerCase()

  if (!isConnected || !hydrated) return null

  return (
    <div className="bg-rootstock-card rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-2">Create your multisig</h2>
      <p className="text-sm text-rootstock-muted mb-4">
        Deploy a new wallet on-chain with your owners and threshold (e.g. 2 of 3). Gas is paid by your connected
        wallet ({address?.slice(0, 8)}…).
      </p>

      <div className="mb-4 p-3 rounded-lg bg-rootstock-surface border border-rootstock">
        <p className="text-xs text-rootstock-muted mb-1">Active multisig contract</p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-rootstock-orange text-sm break-all">{multisigAddress ?? 'Not set'}</code>
          <button
            type="button"
            onClick={() => {
              if (!multisigAddress) return
              navigator.clipboard
                .writeText(multisigAddress)
                .then(() => toast.success('Copied'))
                .catch(() => toast.error('Copy failed'))
            }}
            className="text-rootstock-orange p-1"
            aria-label="Copy active multisig address"
          >
            <FaCopy />
          </button>
        </div>
        {lastDeployed && (
          <div className="mt-3 p-3 rounded-lg bg-rootstock-panel border border-rootstock">
            <p className="text-xs text-rootstock-muted mb-2">Deployment success</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="text-white text-sm">{truncateAddress(lastDeployed)}</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard
                    .writeText(lastDeployed)
                    .then(() => toast.success('Copied'))
                    .catch(() => toast.error('Copy failed'))
                }}
                className="text-rootstock-orange p-1"
                aria-label="Copy deployed multisig address"
              >
                <FaCopy />
              </button>
              <Link
                href={getExplorerAddressUrl(lastDeployed)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rootstock-orange hover:underline transition-colors p-1"
                aria-label="Open deployed contract in explorer"
              >
                <FaExternalLinkAlt />
              </Link>
            </div>
            <p className="mt-2 text-xs text-rootstock-muted">Next: fund the multisig before executing value transfers.</p>
          </div>
        )}
        {usingCustom && (
          <button
            type="button"
            onClick={() => {
              resetToDefaultMultisig()
              toast.success('Switched to default contract from .env')
            }}
            className="mt-2 text-xs text-rootstock-muted underline hover:text-white"
          >
            Use default wallet (.env) instead
          </button>
        )}
        {missingEnvDefault && (
          <p className="mt-2 text-xs text-rootstock-muted">
            Default contract is not configured. Set <code className="text-white">NEXT_PUBLIC_MULTISIG_ADDRESS</code> in{' '}
            <code className="text-white">frontend/.env.local</code>, or deploy a new multisig above.
          </p>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <p className="text-sm font-semibold text-white">Owner addresses</p>
        {ownerRows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder={`Owner ${i + 1} (0x…)`}
              value={row}
              onChange={(e) => setRow(i, e.target.value)}
              className="flex-1 px-3 py-2 bg-rootstock-surface border border-rootstock rounded-lg text-white text-sm placeholder-rootstock-subtle focus:outline-none focus:ring-2 focus:ring-[var(--rootstock-orange)]"
            />
            {ownerRows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="px-3 py-2 bg-rootstock-muted text-rootstock-muted rounded-lg hover:text-white"
                aria-label="Remove owner"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 text-sm text-rootstock-orange hover:underline"
        >
          <FaPlus /> Add owner
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="createMultisigRequired" className="block text-sm font-semibold text-white mb-1">
          Required confirmations (M of N)
        </label>
        <input
          id="createMultisigRequired"
          type="number"
          min={1}
          max={ownerRows.filter((s) => s.trim()).length || 99}
          value={requiredStr}
          onChange={(e) => setRequiredStr(e.target.value)}
          className="w-32 px-3 py-2 bg-rootstock-surface border border-rootstock rounded-lg text-white"
        />
        <p className="text-xs text-rootstock-subtle mt-1">
          Must be ≥ 1 and ≤ number of non-empty owner addresses.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDeploy}
        disabled={isDeployPending || isConfirming || !deployBytecode}
        className="w-full sm:w-auto px-6 py-3 bg-rootstock-orange text-white font-semibold rounded-lg hover:bg-rootstock-orange-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeployPending || isConfirming
          ? 'Deploying… (confirm in wallet)'
          : !deployBytecode
            ? 'Loading bytecode…'
            : 'Deploy new multisig'}
      </button>

      {deployHash && (
        <p className="mt-3 text-xs text-rootstock-muted break-all">
          Tx: {deployHash}
        </p>
      )}
    </div>
  )
}
