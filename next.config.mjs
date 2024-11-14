/** @type {import('next').NextConfig} */
const nextConfig = {
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
          protocol: 'https',
          hostname: 'hiresprintcanvas.dreamhosters.com',
          pathname: '/**',
        }
      ],
    },
  };

  export default nextConfig;
