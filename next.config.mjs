/** @type {import('next').NextConfig} */
const nextConfig = {
  // Shared hosting caps process count; default (one worker per CPU) fails with spawn EAGAIN.
  experimental: { cpus: 1, workerThreads: false },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
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
      { protocol: "https", hostname: "api.dartsmalawi.org", pathname: "/uploads/**" },
      { protocol: "https", hostname: "api.dartsmalawi.org", pathname: "/images/**" }, // add
    ],
  },
};

export default nextConfig;
