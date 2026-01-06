import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Rootstock Multisig Wallet',
  description: 'Multisignature wallet demo for Rootstock (RSK)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#ededed',
                border: '1px solid #2a2a2a',
              },
              success: {
                iconTheme: {
                  primary: '#00aa00',
                  secondary: '#ededed',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff4444',
                  secondary: '#ededed',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}


