import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-select',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      'class-variance-authority',
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;