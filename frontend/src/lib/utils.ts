import { formatEther, parseEther } from 'viem'

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
  } catch (error) {
    console.error('Error formatting RBTC:', error)
    return '0'
  }
}

/**
 * Parse RBTC amount from ether string to wei
 */
export function parseRBTC(ether: string): bigint {
  try {
    return parseEther(ether)
  } catch (error) {
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

