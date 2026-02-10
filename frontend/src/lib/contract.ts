import { Address } from 'viem'
import MultiSigWalletABI from '@/abi/MultiSigWallet.json'
import type { Abi } from 'viem'

/**
 * Contract configuration
 * Update NEXT_PUBLIC_MULTISIG_ADDRESS in .env.local with your deployed contract address
 */
export const MULTISIG_ADDRESS = (process.env.NEXT_PUBLIC_MULTISIG_ADDRESS || 
  '0x3886eC7a6ca3841944a27439126096d6978f8884') as Address

// Ensure ABI is properly typed as an array for wagmi compatibility
export const MULTISIG_ABI = MultiSigWalletABI as Abi

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
