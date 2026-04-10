import { formatEther, parseEther, isAddress, isHex } from 'viem'

/**
 * Format RBTC amount from wei to ether
 */
export function formatRBTC(wei: bigint | string | undefined | null): string {
  if (wei === undefined || wei === null) {
    return '0'
  }
  try {
    const value = typeof wei === 'string' ? BigInt(wei) : wei
    return formatEther(value)
  } catch {
    return '0'
  }
}

/**
 * Parse RBTC amount from ether string to wei
 */
export function parseRBTC(ether: string): bigint {
  try {
    return parseEther(ether)
  } catch {
    throw new Error(`Invalid RBTC amount: ${ether}`)
  }
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, length: number = 6): string {
  if (!address) return ''
  if (address.length <= length * 2 + 2) return address
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

/**
 * Get Rootstock explorer URL for transaction
 */
export function getExplorerTxUrl(txHash: string): string {
  const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://explorer.testnet.rsk.co'
  return `${explorerBase}/tx/${txHash}`
}

/**
 * Get Rootstock explorer URL for address
 */
export function getExplorerAddressUrl(address: string): string {
  const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://explorer.testnet.rsk.co'
  return `${explorerBase}/address/${address}`
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  if (!address) return false
  try {
    return isAddress(address)
  } catch {
    return false
  }
}

/**
 * Validate hex string format
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return true // Empty is valid (will be converted to 0x)
  try {
    // Remove 0x prefix if present for validation
    const hexWithoutPrefix = hex.startsWith('0x') ? hex.slice(2) : hex
    // Check if it's a valid hex string (only 0-9, a-f, A-F)
    if (!/^[0-9a-fA-F]+$/.test(hexWithoutPrefix)) return false
    // Use viem's isHex for additional validation
    return isHex(hex.startsWith('0x') ? hex : `0x${hex}`)
  } catch {
    return false
  }
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try {
    return JSON.stringify(err)
  } catch {
    return 'Unknown error'
  }
}

/**
 * Map common wallet / RPC errors to short UI copy; avoid dumping raw wagmi internals in toasts.
 */
export function formatUserFacingWalletError(err: unknown, action: string): string {
  const msg = getErrorMessage(err).toLowerCase()

  if (msg.includes('user rejected') || msg.includes('rejected the request') || msg.includes('denied transaction')) {
    return `${action} was cancelled in the wallet.`
  }
  if (msg.includes('insufficient funds')) {
    return `${action} failed: insufficient funds for gas.`
  }
  if (msg.includes('nonce too low')) {
    return `${action} failed: stale nonce. Try again after the pending transaction clears.`
  }
  if (msg.includes('replacement transaction underpriced')) {
    return `${action} failed: a pending transaction with the same nonce needs a higher gas price to replace.`
  }

  return `${action} failed. Please try again.`
}
