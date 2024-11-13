/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb' // Ajusta este valor según tus necesidades
    }
  },
  api: {
    bodyParser: {
      sizeLimit: '20mb' // Ajusta este valor según tus necesidades
    },
  },
    i18n: {
      locales: ['en', 'es'],
      defaultLocale: 'en',
      localeDetection: false // Desactiva la detección automática del idioma
    },
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
        {
          protocol: 'http',
          hostname: '173.236.219.227',
          port: '3003',
          pathname: '/**',
        }
      ],
    },
  };

  export default nextConfig;
