'use client'

import { RootstockLogo } from './RootstockLogo'
import { ConnectButton } from './ConnectButton'
import { useAccount } from 'wagmi'

export function Hero() {
  const { isConnected } = useAccount()

  return (
    <section className="bg-gradient-to-b from-black via-[#1a1a1a] to-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <RootstockLogo className="w-20 h-20" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Rootstock Multisig Wallet
          </h1>
          <p className="text-xl md:text-2xl text-[#a0a0a0] mb-4 max-w-3xl mx-auto">
            Secure, decentralized multisignature wallet on the Bitcoin DeFi Layer
          </p>
          <p className="text-lg text-[#666] mb-8 max-w-2xl mx-auto">
            Require multiple approvals for transactions. Built on Rootstock (RSK) for maximum security.
          </p>
          {!isConnected && (
            <div className="mt-8">
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

