/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "sg.pufacomputing.live", 
      "id.pufacomputing.live",
      "api.dicebear.com",
      "example.com"
    ],
  },
  httpAgentOptions: {
      keepAlive: false,
  },
};

module.exports = nextConfig;
