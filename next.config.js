module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // This is important to prevent issues with server-side rendering
      config.node = {
        fs: "empty",
      };
    }
    return config;
  },
};
