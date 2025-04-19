/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "sg.pufacomputing.live", 
      "id.pufacomputing.live",
      "api.dicebear.com",
      "example.com",
      "ik.imagekit.io",
      "via.placeholder.com",
      "pufacompsci.my.id"
    ],
  },
  httpAgentOptions: {
      keepAlive: false,
  },
};

module.exports = nextConfig;
