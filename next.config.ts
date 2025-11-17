import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/applications',
        destination: '/applications',
      },
      {
        source: '/dashboard/applications/:id',
        destination: '/applications/:id',
      },
    ]
  },
}

export default nextConfig
