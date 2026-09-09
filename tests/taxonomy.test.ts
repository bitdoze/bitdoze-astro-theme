import { describe, expect, it } from "vitest";
import { normalizeTaxonomy, taxonomySlug } from "../src/utils/slug";

describe("normalizeTaxonomy", () => {
  it("merges case variants by slug and keeps the first label", () => {
    expect(normalizeTaxonomy(["Astro", "astro"])).toEqual([
      { slug: "astro", label: "Astro" },
    ]);
  });

  it("gives non-Latin labels a non-empty slug and preserves the label", () => {
    const [entry] = normalizeTaxonomy(["中文"]);
    expect(entry?.slug).toBe("%E4%B8%AD%E6%96%87");
    expect(entry?.label).toBe("中文");
  });

  it("keeps distinct non-Latin labels distinct", () => {
    const entries = normalizeTaxonomy(["中文", "日本語", "中文"]);
    expect(entries).toHaveLength(2);
    expect(entries[0]?.slug).not.toBe(entries[1]?.slug);
    expect(entries.map((entry) => entry.label)).toEqual(["中文", "日本語"]);
  });

  it("dedupes mixed sets by slug in first-occurrence order", () => {
    const entries = normalizeTaxonomy([
      "Web Dev",
      "web dev",
      "中文",
      "WEB-DEV",
      "中文",
      "Design & Développement",
    ]);
    expect(entries).toEqual([
      { slug: "web-dev", label: "Web Dev" },
      { slug: "%E4%B8%AD%E6%96%87", label: "中文" },
      { slug: "design-and-developpement", label: "Design & Développement" },
    ]);
  });

  it("is order-stable for identical input", () => {
    const labels = ["Zsh", "astro", "Astro", "web dev", "中文"];
    expect(normalizeTaxonomy(labels)).toEqual(normalizeTaxonomy([...labels]));
  });

  it("encodes punctuation-only labels instead of dropping them", () => {
    expect(normalizeTaxonomy(["!!!"])).toEqual([
      { slug: "%21%21%21", label: "!!!" },
    ]);
  });

  it("never emits an empty slug", () => {
    const entries = normalizeTaxonomy([
      "C++",
      "Node.js",
      "中文",
      "é",
      "!!!",
    ]);
    for (const { slug } of entries) {
      expect(slug.length).toBeGreaterThan(0);
    }
    expect(entries.map((entry) => entry.slug)).toEqual([
      "c",
      "node-js",
      "%E4%B8%AD%E6%96%87",
      "e",
      "%21%21%21",
    ]);
  });
});

describe("taxonomySlug", () => {
  it("matches slugify for Latin labels", () => {
    expect(taxonomySlug("Design & Dev")).toBe("design-and-dev");
  });

  it("falls back to the same deterministic encoding as normalizeTaxonomy", () => {
    expect(taxonomySlug("中文")).toBe(normalizeTaxonomy(["中文"])[0]?.slug);
  });

  it("throws an actionable error naming the label when no slug is possible", () => {
    expect(() => taxonomySlug("")).toThrow(/""/);
    expect(() => taxonomySlug("   ")).toThrow(/label "   "/);
    expect(() => normalizeTaxonomy(["ok", ""])).toThrow(
      /\[taxonomy\].*label ""/,
    );
  });
});
