'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Rootstock (RSK)?',
    answer: 'Rootstock (RSK) is a smart contract platform secured by the Bitcoin network. It enables DeFi applications on Bitcoin through sidechain technology and merged mining.',
  },
  {
    question: 'How many owners can a multisig wallet have?',
    answer: 'There is no hard limit on the number of owners, but you must specify at least one owner and the required confirmations must be less than or equal to the total number of owners.',
  },
  {
    question: 'Can I change the required number of confirmations?',
    answer: 'No, the required confirmations are set when the contract is deployed and cannot be changed. This is a security feature to prevent unauthorized modifications.',
  },
  {
    question: 'What happens if I lose access to my wallet?',
    answer: 'As long as enough other owners still have access, the multisig wallet can continue to function. However, if too many owners lose access and the required confirmations cannot be met, funds may become inaccessible.',
  },
  {
    question: 'Can I add or remove owners after deployment?',
    answer: 'The current implementation does not support adding or removing owners after deployment. The owner list is fixed at contract creation. Future versions may include this feature.',
  },
  {
    question: 'What network should I use?',
    answer: 'This demo is configured for Rootstock Testnet (Chain ID: 31). Make sure your MetaMask is connected to the correct network before interacting with the contract.',
  },
  {
    question: 'How much does it cost to use the multisig wallet?',
    answer: 'You only pay gas fees (in RBTC) for transactions you submit, approve, or execute. Viewing transactions and wallet information is free.',
  },
  {
    question: 'Can I revoke my approval?',
    answer: 'Yes, you can revoke your approval for any pending transaction before it is executed. Once executed, transactions cannot be reversed.',
  },
  {
    question: 'What if a transaction fails to execute?',
    answer: 'If execution fails (e.g., insufficient funds, invalid recipient), the transaction remains in pending state and can be retried once the issue is resolved.',
  },
  {
    question: 'Is this wallet audited?',
    answer: 'This is a demo application. For production use, always conduct thorough security audits and use audited smart contract libraries like OpenZeppelin.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-[#2a2a2a] transition-colors"
                >
                  <span className="text-white font-semibold">{faq.question}</span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-[#FF6600] flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-[#a0a0a0] flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 border-t border-[#2a2a2a]">
                    <p className="text-[#a0a0a0] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}












