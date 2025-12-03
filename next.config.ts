import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'omo.akamai.opta.net',
        port: '',
        pathname: '/image.php',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async redirects() {
    return [
      {
        source: '/info/know-before-you-go',
        destination: '/fort-lauderdale/know-before-you-go',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
