/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
