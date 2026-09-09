import { describe, expect, it } from "vitest";
import { buildToc, type TocHeadingInput } from "../src/utils/toc";

const h = (depth: number, slug: string, text = slug): TocHeadingInput => ({
  depth,
  slug,
  text,
});

describe("buildToc", () => {
  it("returns an empty list for empty input", () => {
    expect(buildToc([])).toEqual([]);
  });

  it("promotes a leading depth-3 heading to root", () => {
    const toc = buildToc([h(3, "first")]);
    expect(toc).toHaveLength(1);
    expect(toc[0]).toMatchObject({ depth: 3, slug: "first" });
    expect(toc[0].subheadings).toEqual([]);
  });

  it("excludes depth-4 headings and keeps the depth-2 root", () => {
    const toc = buildToc([h(2, "a"), h(4, "deep")]);
    expect(toc).toHaveLength(1);
    expect(toc[0].slug).toBe("a");
    expect(toc[0].subheadings).toEqual([]);
  });

  it("ignores a body H1 and nests following H2/H3 without crashing", () => {
    const toc = buildToc([h(1, "title"), h(2, "a"), h(3, "a-1"), h(3, "a-2")]);
    expect(toc).toHaveLength(1);
    expect(toc[0].slug).toBe("a");
    expect(toc[0].subheadings.map((s) => s.slug)).toEqual(["a-1", "a-2"]);
  });

  it("preserves document order with normal H2/H3 nesting", () => {
    const toc = buildToc([
      h(2, "intro"),
      h(3, "why"),
      h(2, "setup"),
      h(3, "install"),
      h(3, "configure"),
      h(2, "outro"),
    ]);
    expect(toc.map((x) => x.slug)).toEqual(["intro", "setup", "outro"]);
    expect(toc[0].subheadings.map((x) => x.slug)).toEqual(["why"]);
    expect(toc[1].subheadings.map((x) => x.slug)).toEqual(["install", "configure"]);
    expect(toc[2].subheadings).toEqual([]);
  });
});
