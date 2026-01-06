'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FaShieldAlt, FaUsers, FaCheckCircle, FaLock } from 'react-icons/fa'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-8">About Multisig Wallet</h1>
          
          <div className="space-y-8">
            {/* What is Multisig */}
            <section className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-[#FF6600]" />
                What is a Multisignature Wallet?
              </h2>
              <p className="text-[#a0a0a0] leading-relaxed">
                A multisignature (multisig) wallet is a cryptocurrency wallet that requires multiple 
                private keys to authorize a transaction. Instead of a single key controlling the funds, 
                multiple owners must approve transactions before they can be executed. This adds an 
                extra layer of security and prevents a single point of failure.
              </p>
            </section>

            {/* How it Works */}
            <section className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaUsers className="text-[#FF6600]" />
                How It Works
              </h2>
              <div className="space-y-4 text-[#a0a0a0]">
                <div className="flex items-start gap-3">
                  <span className="text-[#FF6600] font-bold">1.</span>
                  <p><strong className="text-white">Submit Transaction:</strong> Any owner can submit a transaction proposal with recipient address, amount, and optional data.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#FF6600] font-bold">2.</span>
                  <p><strong className="text-white">Approve Transaction:</strong> Other owners review and approve the transaction. Each approval counts toward the required threshold.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#FF6600] font-bold">3.</span>
                  <p><strong className="text-white">Execute Transaction:</strong> Once enough owners have approved (meeting the required confirmations), any owner can execute the transaction.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#FF6600] font-bold">4.</span>
                  <p><strong className="text-white">Revoke (Optional):</strong> Owners can revoke their approval before execution if they change their mind.</p>
                </div>
              </div>
            </section>

            {/* Security Features */}
            <section className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaLock className="text-[#FF6600]" />
                Security Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Multiple Approvals Required</h3>
                    <p className="text-[#a0a0a0] text-sm">Transactions require M out of N owner approvals, preventing unauthorized access.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">On-Chain Transparency</h3>
                    <p className="text-[#a0a0a0] text-sm">All transactions and approvals are recorded on the blockchain for full transparency.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Reentrancy Protection</h3>
                    <p className="text-[#a0a0a0] text-sm">Built with OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Safe Transfer</h3>
                    <p className="text-[#a0a0a0] text-sm">Uses safe call() method for RBTC transfers, preventing common vulnerabilities.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Use Cases</h2>
              <ul className="space-y-2 text-[#a0a0a0]">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6600]">•</span>
                  <span><strong className="text-white">Organizations:</strong> Require multiple executives to approve large transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6600]">•</span>
                  <span><strong className="text-white">DAOs:</strong> Community-governed funds requiring member consensus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6600]">•</span>
                  <span><strong className="text-white">Personal Security:</strong> Family or business partners managing shared funds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6600]">•</span>
                  <span><strong className="text-white">Escrow Services:</strong> Requiring multiple parties to release funds</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


