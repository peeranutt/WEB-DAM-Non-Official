import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverComponentsExternalPackages: ['@mapbox/mapbox-gl-geocoder'], 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'dam-api',
        port: '3001',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
