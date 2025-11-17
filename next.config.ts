import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    /**
     * Explicitly set the Turbopack root so Next.js does not try to infer it
     * from parent directories that might also contain lockfiles.
     */
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
