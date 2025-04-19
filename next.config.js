/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "sg.pufacomputing.live", 
      "id.pufacomputing.live",
      "api.dicebear.com",
      "via.placeholder.com",
      "example.com",
      "ik.imagekit.io",
      "pufacompsci.my.id"
    ],
  },
  httpAgentOptions: {
      keepAlive: false,
  },
};

module.exports = nextConfig;
