import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
    localPatterns: [
      {
        pathname: "/images/**",
        // sem `search`: permite `?v=...` para invalidar cache do optimizador
      },
    ],
  },
};

export default nextConfig;
