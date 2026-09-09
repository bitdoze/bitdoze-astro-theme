import { afterEach, describe, expect, it, vi } from "vitest";
import { getPostUrl, withBase } from "../src/utils/slug";
import { getPagination } from "../src/utils/pagination";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("withBase at the default root base", () => {
  it("leaves internal paths byte-identical", () => {
    vi.stubEnv("BASE_URL", "/");
    expect(withBase("/blog/")).toBe("/blog/");
    expect(withBase("/")).toBe("/");
    expect(withBase("/blog/hello-world/")).toBe("/blog/hello-world/");
    expect(withBase("search/")).toBe("search/");
  });

  it("passes through external, protocol-relative, and hash/query-only references", () => {
    vi.stubEnv("BASE_URL", "/");
    expect(withBase("https://example.com/x/")).toBe("https://example.com/x/");
    expect(withBase("//cdn.example.com/a.png")).toBe("//cdn.example.com/a.png");
    expect(withBase("mailto:hi@example.com")).toBe("mailto:hi@example.com");
    expect(withBase("#main-content")).toBe("#main-content");
    expect(withBase("?q=astro")).toBe("?q=astro");
  });
});

describe("withBase under a subpath base", () => {
  it("joins the base with exactly one separating slash", () => {
    vi.stubEnv("BASE_URL", "/theme");
    expect(withBase("/blog/")).toBe("/theme/blog/");
    expect(withBase("/blog")).toBe("/theme/blog");
    expect(withBase("/")).toBe("/theme/");
    expect(withBase("search/")).toBe("/theme/search/");
  });

  it("normalizes a trailing slash on BASE_URL", () => {
    vi.stubEnv("BASE_URL", "/theme/");
    expect(withBase("/blog/")).toBe("/theme/blog/");
    expect(withBase("/")).toBe("/theme/");
  });

  it("still passes through external and hash/query-only references", () => {
    vi.stubEnv("BASE_URL", "/theme");
    expect(withBase("https://example.com/x/")).toBe("https://example.com/x/");
    expect(withBase("//cdn.example.com/a.png")).toBe("//cdn.example.com/a.png");
    expect(withBase("#top")).toBe("#top");
    expect(withBase("?page=2")).toBe("?page=2");
  });

  it("preserves the path's own trailing slash", () => {
    vi.stubEnv("BASE_URL", "/theme");
    expect(withBase("/tags/astro/")).toBe("/theme/tags/astro/");
    expect(withBase("/tags/astro")).toBe("/theme/tags/astro");
  });
});

describe("withBase consumers", () => {
  it("getPostUrl keeps root URLs identical", () => {
    vi.stubEnv("BASE_URL", "/");
    expect(getPostUrl({ id: "hello-world.md", data: {} })).toBe("/hello-world/");
  });

  it("getPostUrl prefixes a subpath base", () => {
    vi.stubEnv("BASE_URL", "/theme");
    expect(getPostUrl({ id: "guides/Install Guide.md", data: {} })).toBe(
      "/theme/guides/install-guide/",
    );
  });

  it("pagination links stay root-relative at the default base", () => {
    vi.stubEnv("BASE_URL", "/");
    const { prevUrl, nextUrl } = getPagination({
      page: 2,
      totalPosts: 30,
      postsPerPage: 10,
      basePath: "/blog/",
    });
    expect(prevUrl).toBe("/blog/");
    expect(nextUrl).toBe("/blog/page/3/");
  });

  it("pagination links carry the subpath base", () => {
    vi.stubEnv("BASE_URL", "/theme");
    const { prevUrl, nextUrl } = getPagination({
      page: 2,
      totalPosts: 30,
      postsPerPage: 10,
      basePath: "/blog/",
    });
    expect(prevUrl).toBe("/theme/blog/");
    expect(nextUrl).toBe("/theme/blog/page/3/");
  });
});
