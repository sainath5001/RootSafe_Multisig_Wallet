import { Address, isAddress } from 'viem'
import MultiSigWalletABI from '@/abi/MultiSigWallet.json'
import type { Abi } from 'viem'

/**
 * Contract configuration
 * Update NEXT_PUBLIC_MULTISIG_ADDRESS in .env.local with your deployed contract address
 */
/** Env-configured multisig address (required for default mode) */
export const ENV_MULTISIG_ADDRESS = process.env.NEXT_PUBLIC_MULTISIG_ADDRESS as Address | undefined

export function getDefaultMultisigAddress(): Address | null {
  if (!ENV_MULTISIG_ADDRESS) return null
  return isAddress(ENV_MULTISIG_ADDRESS) ? (ENV_MULTISIG_ADDRESS as Address) : null
}

/**
 * ABI must be an array for wagmi/viem (they use .filter() on it).
 * Support both: raw ABI array JSON or full Foundry artifact { abi, bytecode, ... }.
 */
const rawAbi = MultiSigWalletABI as unknown
export const MULTISIG_ABI: Abi = Array.isArray(rawAbi)
  ? (rawAbi as Abi)
  : (rawAbi as { abi: Abi }).abi

/**
 * Transaction structure from the contract
 */
export type Transaction = {
  to: Address
  value: bigint
  data: `0x${string}`
  executed: boolean
  numConfirmations: bigint
}

type TransactionTuple = readonly [Address, bigint, `0x${string}`, boolean, bigint]

export function normalizeTransaction(raw: unknown): Transaction {
  const zeroAddr = '0x0000000000000000000000000000000000000000' as Address
  const fallback: Transaction = {
    to: zeroAddr,
    value: 0n,
    data: '0x',
    executed: false,
    numConfirmations: 0n,
  }

  if (!raw) return fallback

  if (Array.isArray(raw)) {
    const t = raw as unknown as TransactionTuple
    return {
      to: (t[0] ?? fallback.to) as Address,
      value: (t[1] ?? fallback.value) as bigint,
      data: (t[2] ?? fallback.data) as `0x${string}`,
      executed: (t[3] ?? fallback.executed) as boolean,
      numConfirmations: (t[4] ?? fallback.numConfirmations) as bigint,
    }
  }

  if (typeof raw === 'object') {
    const o = raw as any
    return {
      to: (o.to ?? fallback.to) as Address,
      value: (o.value ?? fallback.value) as bigint,
      data: (o.data ?? fallback.data) as `0x${string}`,
      executed: (o.executed ?? fallback.executed) as boolean,
      numConfirmations: (o.numConfirmations ?? fallback.numConfirmations) as bigint,
    }
  }

  return fallback
}
