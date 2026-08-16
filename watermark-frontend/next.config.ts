import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["node_modules/sharp/**/*"],
  },
};

export default nextConfig;
