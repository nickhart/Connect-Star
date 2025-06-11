/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@connect-star/ui', '@connect-star/game-logic', '@connect-star/types', '@connect-star/api-client'],
}

module.exports = nextConfig