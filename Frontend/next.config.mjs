/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['files.edgestore.dev', 'img.clerk.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'files.edgestore.dev',
          port: ''
        }
      ]
    }
  }

export default nextConfig;
