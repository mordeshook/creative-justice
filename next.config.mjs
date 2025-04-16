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
          hostname: 'tyxhurtlifaufindxhex.supabase.co', // your actual Supabase project
          pathname: '/storage/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  