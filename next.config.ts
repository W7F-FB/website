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
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tournament/fort-lauderdale',
        permanent: true,
      },
      {
        source: '/info/know-before-you-go',
        destination: '/fort-lauderdale/know-before-you-go',
        permanent: true,
      },
      {
        source: '/tickets',
        destination: '/tournament/fort-lauderdale',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
