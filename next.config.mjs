/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  trailingSlash: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // dev API
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/images/**" }, // add
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/images/**" }, // add
      // prod API
      { protocol: "https", hostname: "api.dartsmw.org", pathname: "/uploads/**" },
      { protocol: "https", hostname: "api.dartsmw.org", pathname: "/images/**" }, // add
    ],
  },
};

export default nextConfig;
