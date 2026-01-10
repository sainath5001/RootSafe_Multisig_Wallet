'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { StatsCards } from '@/components/StatsCards'
import { Footer } from '@/components/Footer'
import { SubmitTxForm } from '@/components/SubmitTxForm'
import { TxListSimple as TxList } from '@/components/TxList'
import { OwnersList } from '@/components/OwnersList'
import { WalletDashboard } from '@/components/WalletDashboard'
import { useAccount } from 'wagmi'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      <Hero />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <StatsCards />
          
          {isMounted && isConnected ? (
            <div className="mt-12 space-y-6">
              <WalletDashboard />
              <OwnersList />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <SubmitTxForm />
                </div>
                <div>
                  <TxList />
                </div>
              </div>
            </div>
          ) : isMounted ? (
            <div className="mt-12 text-center">
              <p className="text-[#a0a0a0] text-lg">
                Connect your wallet to start using the multisig wallet
              </p>
            </div>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-[#a0a0a0] text-lg">Loading...</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

