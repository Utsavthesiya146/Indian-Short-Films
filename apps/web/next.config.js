/** @type {import('next').NextNodeConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/Admin',
        destination: '/admin',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
