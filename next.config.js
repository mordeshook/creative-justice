// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tyxhurtlifaufindxhex.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
  experimental: {
    forceSwcTransforms: true, // ✅ Force fresh chunk hash regeneration
  },
  webpack: (config) => {
    config.externals.push("canvas");
    return config;
  },
};

module.exports = nextConfig;
