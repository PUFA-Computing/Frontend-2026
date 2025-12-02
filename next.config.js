/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sg.pufacomputing.live',
      },
      {
        protocol: 'https',
        hostname: 'id.pufacomputing.live',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'pufacompsci.my.id',
      },
    ],
  },
  httpAgentOptions: {
    keepAlive: false,
  },
};

module.exports = nextConfig;
