import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.fbi.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fbi.gov',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
