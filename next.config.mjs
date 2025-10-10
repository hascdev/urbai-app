/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore canvas on the client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
      }
    }
    
    // Ignore canvas native bindings
    config.externals = config.externals || []
    config.externals.push({
      canvas: 'canvas',
    })
    
    return config
  },
}

export default nextConfig
