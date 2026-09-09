/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/',
        permanent: false,
      },
      {
        source: '/pptupload',
        destination: '/',
        permanent: false,
      },
      {
        source: '/authletterupload',
        destination: '/',
        permanent: false,
      },
      {
        source: '/submit-idea',
        destination: '/',
        permanent: false,
      },
      {
        source: '/guidelines',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
