/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['firebasestorage.googleapis.com'],
  },
  // Add cache busting and fix chunk loading issues
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Disable static optimization for problematic pages
  experimental: {
    esmExternals: false,
  },
  // Ensure proper chunk loading
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
