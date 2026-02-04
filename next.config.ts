import type { NextConfig } from "next";

const inDevMode = process.env.DEV === "true";

/* 1 - below attributes added explicitly added here for github pages */
const githubConfig: NextConfig = inDevMode ? {} : {
  // output: 'export',
  images: {
    unoptimized: true // REQUIRED for GitHub Pages
  }
};
/* end 1 */

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  ...githubConfig
};

export default nextConfig;
