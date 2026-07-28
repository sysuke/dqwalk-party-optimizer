import { describe, expect, it } from "vitest";
import { getGitHubPagesConfig } from "./github-pages";

describe("getGitHubPagesConfig", () => {
  it("returns an empty base path for local builds", () => {
    expect(getGitHubPagesConfig("", false)).toEqual({
      basePath: "",
      assetPrefix: "",
      trailingSlash: true,
    });
  });

  it("uses the repository name for GitHub Pages deployments", () => {
    expect(getGitHubPagesConfig("dqwalk-party-optimizer", true)).toEqual({
      basePath: "/dqwalk-party-optimizer",
      assetPrefix: "/dqwalk-party-optimizer/",
      trailingSlash: true,
    });
  });
});
