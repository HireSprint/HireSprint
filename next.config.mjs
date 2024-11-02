/** @type {import('next').NextConfig} */
const nextConfig = {
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
        API_URL: 'http://localhost:3003',
    }
  };

  export default nextConfig;
