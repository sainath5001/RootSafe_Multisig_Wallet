'use client'

import Link from 'next/link'
import { 
  FaGithub, 
  FaTwitter, 
  FaDiscord, 
  FaBook, 
  FaExternalLinkAlt,
  FaHeart
} from 'react-icons/fa'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-[#2a2a2a] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Rootstock Multisig</h3>
            <p className="text-[#a0a0a0] text-sm mb-4">
              A secure multisignature wallet built on Rootstock (RSK), the Bitcoin DeFi Layer.
            </p>
            <p className="text-[#a0a0a0] text-sm flex items-center gap-2">
              Built with <FaHeart className="text-[#FF6600]" /> for Rootstock
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://rootstock.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm flex items-center gap-2 transition-colors"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  Rootstock Website
                </Link>
              </li>
              <li>
                <Link
                  href="https://developers.rsk.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm flex items-center gap-2 transition-colors"
                >
                  <FaBook className="text-xs" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://explorer.testnet.rsk.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm flex items-center gap-2 transition-colors"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  Block Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/rootstock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm flex items-center gap-2 transition-colors"
                >
                  <FaGithub className="text-xs" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com/rootstock_io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm flex items-center gap-2 transition-colors"
                >
                  <FaTwitter className="text-xs" />
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.gg/rootstock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm flex items-center gap-2 transition-colors"
                >
                  <FaDiscord className="text-xs" />
                  Discord
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Project</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#a0a0a0] hover:text-[#FF6600] text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#2a2a2a]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#a0a0a0] text-sm">
              © {currentYear} Rootstock Multisig Wallet. All rights reserved.
            </p>
            <p className="text-[#a0a0a0] text-sm">
              Powered by <span className="text-[#FF6600]">Rootstock (RSK)</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}


