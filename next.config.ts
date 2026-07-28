import type { NextConfig } from "next";
import { getGitHubPagesConfig } from "./src/lib/github-pages";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGitHubPages =
  process.env.GITHUB_ACTIONS === "true" ||
  process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  ...getGitHubPagesConfig(repoName, isGitHubPages),
};

export default nextConfig;
