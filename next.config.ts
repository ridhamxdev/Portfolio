import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/gh/devicons/devicon/**',
      },
    ],
  },
  /* config options here */
  allowedDevOrigins: ['192.168.0.114']
};

export default nextConfig;
