import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect old /in/* routes to new /username structure
      {
        source: '/in/:username',
        destination: '/:username',
        permanent: true,
      },
      {
        source: '/in/:username/edit',
        destination: '/:username/edit',
        permanent: true,
      },
      // Redirect old /@username to /username
      {
        source: '/@:username',
        destination: '/:username',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
