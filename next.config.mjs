/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    compress: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.supabase.co',
        },
        {
          protocol: 'https',
          hostname: 'cdn.phototourl.com',
        },
      ],
    },
};

export default nextConfig;
