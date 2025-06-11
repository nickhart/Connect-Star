/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@connect-star/ui', '@connect-star/game-logic', '@connect-star/types', '@connect-star/api-client'],
}

module.exports = nextConfig