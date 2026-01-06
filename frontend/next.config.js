/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize for lower memory usage
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Increase timeout for slow compilations
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { isServer, webpack }) => {
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
