import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 🛑 ADVERTENCIA: Esto ignora todos los errores y advertencias de ESLint
    // durante la compilación de producción (next build).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
