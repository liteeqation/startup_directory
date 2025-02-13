module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "media.istockphoto.com", // Added media.istockphoto.com
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};
