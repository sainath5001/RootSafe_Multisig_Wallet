'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FaBook, FaCode, FaRocket, FaWallet } from 'react-icons/fa'
import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <FaBook className="text-[#FF6600] text-3xl" />
            <h1 className="text-4xl font-bold text-white">Documentation</h1>
          </div>
          
          <div className="space-y-8">
            {/* Quick Start */}
            <section className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaRocket className="text-[#FF6600]" />
                Quick Start
              </h2>
              <div className="space-y-4 text-[#a0a0a0]">
                <div>
                  <h3 className="text-white font-semibold mb-2">1. Connect Your Wallet</h3>
                  <p>Install MetaMask and connect to Rootstock Testnet (Chain ID: 31).</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">2. Verify You're an Owner</h3>
                  <p>Make sure your connected address is one of the multisig wallet owners.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">3. Submit a Transaction</h3>
                  <p>Enter recipient address, amount, and optional data to create a transaction proposal.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">4. Approve and Execute</h3>
                  <p>Wait for required confirmations, then execute the transaction.</p>
                </div>
              </div>
            </section>

            {/* Functions */}
            <section className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaCode className="text-[#FF6600]" />
                Smart Contract Functions
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-[#FF6600] pl-4">
                  <h3 className="text-white font-mono font-semibold">submitTransaction(address to, uint256 value, bytes data)</h3>
                  <p className="text-[#a0a0a0] text-sm mt-1">Submit a new transaction proposal. Returns transaction ID.</p>
                </div>
                <div className="border-l-4 border-[#FF6600] pl-4">
                  <h3 className="text-white font-mono font-semibold">confirmTransaction(uint256 txId)</h3>
                  <p className="text-[#a0a0a0] text-sm mt-1">Approve a pending transaction. Can only be called once per transaction per owner.</p>
                </div>
                <div className="border-l-4 border-[#FF6600] pl-4">
                  <h3 className="text-white font-mono font-semibold">revokeConfirmation(uint256 txId)</h3>
                  <p className="text-[#a0a0a0] text-sm mt-1">Revoke your approval for a pending transaction.</p>
                </div>
                <div className="border-l-4 border-[#FF6600] pl-4">
                  <h3 className="text-white font-mono font-semibold">executeTransaction(uint256 txId)</h3>
                  <p className="text-[#a0a0a0] text-sm mt-1">Execute a transaction that has met the required confirmations.</p>
                </div>
                <div className="border-l-4 border-[#FF6600] pl-4">
                  <h3 className="text-white font-mono font-semibold">getTransaction(uint256 txId)</h3>
                  <p className="text-[#a0a0a0] text-sm mt-1">Get transaction details including recipient, amount, data, execution status, and confirmation count.</p>
                </div>
              </div>
            </section>

            {/* Resources */}
            <section className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaWallet className="text-[#FF6600]" />
                Additional Resources
              </h2>
              <div className="space-y-3">
                <Link
                  href="https://developers.rsk.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#FF6600] hover:text-[#FF8533] transition-colors"
                >
                  → Rootstock Developer Documentation
                </Link>
                <Link
                  href="https://github.com/rootstock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#FF6600] hover:text-[#FF8533] transition-colors"
                >
                  → Rootstock GitHub
                </Link>
                <Link
                  href="https://explorer.testnet.rsk.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#FF6600] hover:text-[#FF8533] transition-colors"
                >
                  → Rootstock Block Explorer
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}









