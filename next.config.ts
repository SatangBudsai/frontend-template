import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const serviceUrl = process.env.SERVICE_URL?.trim().replace(/\/$/, '')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!serviceUrl) return []

    return [
      {
        source: '/api/:path*',
        destination: `${serviceUrl}/api/:path*`
      }
    ]
  }
}

export default withNextIntl(nextConfig)
