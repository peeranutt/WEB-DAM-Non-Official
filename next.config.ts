import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverComponentsExternalPackages: ['@mapbox/mapbox-gl-geocoder'], 
  },
};

export default nextConfig;
