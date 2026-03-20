/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  reactStrictMode: true,
  // Reduce memory during build (helps on low-RAM machines; "Killed" = OOM)
  productionBrowserSourceMaps: false,
  // swcMinify removed: Next.js 15+ uses SWC minification by default
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Memory reduction for low-RAM machines (avoids "Killed" / OOM)
  // webpackBuildWorker left at default (true) so dev server stays up during compile
  experimental: {
    webpackMemoryOptimizations: true,
  },
  // Increase timeout for slow compilations
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { dev, isServer, webpack }) => {
    // Disable webpack cache during production build to reduce peak memory (avoids OOM)
    if (!dev && !isServer) config.cache = false
    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    }
    // Ignore optional dependencies that aren't needed for web
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
        canvas: false,
      }
    }
    
    // Ignore these modules during bundling
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    }
    
    // Use IgnorePlugin to completely ignore these optional dependencies
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@react-native-async-storage\/async-storage$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^pino-pretty$/,
      })
    )
    
    return config
  },
}

module.exports = nextConfig
