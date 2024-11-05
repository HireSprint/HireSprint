/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'v5.airtableusercontent.com',
          pathname: '/**',
        },
      ],
    },
    env:{
        API_URL: 'http://173.236.219.227:3003',
    }
  };

  export default nextConfig;
