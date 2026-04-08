'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FaGithub, FaTwitter, FaDiscord, FaEnvelope } from 'react-icons/fa'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-8">Contact & Support</h1>
          
          <div className="space-y-8">
            {/* Support Channels */}
            <section className="bg-rootstock-card p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Get Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="https://github.com/rootstock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rootstock-muted border border-[var(--rootstock-gray-light)] p-4 rounded-lg hover:border-rootstock-orange transition-all group"
                >
                  <FaGithub className="text-rootstock-orange text-2xl mb-3" />
                  <h3 className="text-white font-semibold mb-2 group-hover:text-rootstock-orange transition-colors">
                    GitHub
                  </h3>
                  <p className="text-rootstock-muted text-sm">
                    Report issues, request features, or contribute to the project
                  </p>
                </Link>

                <Link
                  href="https://twitter.com/rootstock_io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rootstock-muted border border-[var(--rootstock-gray-light)] p-4 rounded-lg hover:border-rootstock-orange transition-all group"
                >
                  <FaTwitter className="text-rootstock-orange text-2xl mb-3" />
                  <h3 className="text-white font-semibold mb-2 group-hover:text-rootstock-orange transition-colors">
                    Twitter
                  </h3>
                  <p className="text-rootstock-muted text-sm">
                    Follow for updates, announcements, and community news
                  </p>
                </Link>

                <Link
                  href="https://discord.gg/rootstock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rootstock-muted border border-[var(--rootstock-gray-light)] p-4 rounded-lg hover:border-rootstock-orange transition-all group"
                >
                  <FaDiscord className="text-rootstock-orange text-2xl mb-3" />
                  <h3 className="text-white font-semibold mb-2 group-hover:text-rootstock-orange transition-colors">
                    Discord
                  </h3>
                  <p className="text-rootstock-muted text-sm">
                    Join the community for real-time support and discussions
                  </p>
                </Link>

                <div className="bg-rootstock-muted border border-[var(--rootstock-gray-light)] p-4 rounded-lg">
                  <FaEnvelope className="text-rootstock-orange text-2xl mb-3" />
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <p className="text-rootstock-muted text-sm">
                    For business inquiries, contact Rootstock directly
                  </p>
                </div>
              </div>
            </section>

            {/* Community */}
            <section className="bg-rootstock-card p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Join the Community</h2>
              <p className="text-rootstock-muted mb-4">
                Rootstock has a vibrant community of developers, users, and enthusiasts. 
                Join us to stay updated on the latest developments, share your projects, 
                and get help when you need it.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="https://github.com/rootstock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-rootstock-orange text-white rounded-lg hover:bg-rootstock-orange-dark transition-colors"
                >
                  Visit GitHub
                </Link>
                <Link
                  href="https://discord.gg/rootstock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-rootstock-muted border border-[var(--rootstock-gray-light)] text-white rounded-lg hover:border-rootstock-orange transition-colors"
                >
                  Join Discord
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














