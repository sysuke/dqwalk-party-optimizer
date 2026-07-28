export function getGitHubPagesConfig(repoName: string, isGitHubPages: boolean) {
  if (!isGitHubPages || !repoName) {
    return {
      basePath: "",
      assetPrefix: "",
      trailingSlash: true,
    };
  }

  return {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    trailingSlash: true,
  };
}
