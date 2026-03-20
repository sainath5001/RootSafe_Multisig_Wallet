'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { type Address, isAddress } from 'viem'
import { DEFAULT_MULTISIG_ADDRESS } from '@/lib/contract'

const STORAGE_KEY = 'rootsafe_multisig_address'

type MultisigContextValue = {
  multisigAddress: Address
  setMultisigAddress: (addr: Address) => void
  resetToDefaultMultisig: () => void
  hydrated: boolean
}

const MultisigContext = createContext<MultisigContextValue | null>(null)

export function MultisigProvider({ children }: { children: ReactNode }) {
  const [multisigAddress, setMultisigAddressState] = useState<Address>(DEFAULT_MULTISIG_ADDRESS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && isAddress(stored)) {
        setMultisigAddressState(stored as Address)
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  const setMultisigAddress = useCallback((addr: Address) => {
    setMultisigAddressState(addr)
    try {
      localStorage.setItem(STORAGE_KEY, addr)
    } catch {
      /* ignore */
    }
  }, [])

  const resetToDefaultMultisig = useCallback(() => {
    setMultisigAddressState(DEFAULT_MULTISIG_ADDRESS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      multisigAddress,
      setMultisigAddress,
      resetToDefaultMultisig,
      hydrated,
    }),
    [multisigAddress, setMultisigAddress, resetToDefaultMultisig, hydrated]
  )

  return <MultisigContext.Provider value={value}>{children}</MultisigContext.Provider>
}

export function useMultisig() {
  const ctx = useContext(MultisigContext)
  if (!ctx) {
    throw new Error('useMultisig must be used within MultisigProvider')
  }
  return ctx
}
