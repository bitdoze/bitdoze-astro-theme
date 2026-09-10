import { describe, expect, it } from "vitest";
import { buildLearningPaths } from "../src/utils/learningPaths";
import type { PostEntry } from "../src/utils/content";

type Data = {
  title?: string;
  date?: Date;
  categories?: string[];
  series?: { name: string; position: number };
};

const makePost = (id: string, data: Data = {}) =>
  ({
    id,
    data: {
      title: data.title ?? id,
      date: data.date ?? new Date("2026-01-01T00:00:00Z"),
      categories: data.categories ?? [],
      tags: [],
      series: data.series,
    },
  }) as unknown as PostEntry;

const seriesPosts = [
  makePost("series-1.md", {
    date: new Date("2026-01-01"),
    series: { name: "Astro Guide", position: 1 },
    categories: ["Web Development"],
  }),
  makePost("series-2.md", {
    date: new Date("2026-02-01"),
    series: { name: "Astro Guide", position: 2 },
    categories: ["Web Development"],
  }),
  makePost("series-3.md", {
    date: new Date("2026-03-01"),
    series: { name: "Astro Guide", position: 3 },
    categories: ["Web Development"],
  }),
];
const topicPosts = [
  makePost("topic-1.md", { date: new Date("2026-04-01"), categories: ["Web Development"] }),
  makePost("topic-2.md", { categories: ["Web Development"] }),
  makePost("topic-3.md", { categories: ["Web Development"] }),
];

describe("buildLearningPaths", () => {
  it("returns a series path in position order plus a topic path", () => {
    const paths = buildLearningPaths([...seriesPosts, ...topicPosts]);

    expect(paths.map((path) => path.kind)).toEqual(["series", "topic"]);
    expect(paths[0]?.name).toBe("Astro Guide");
    expect(paths[0]?.meta).toBe("3-part series");
    expect(paths[0]?.entries.map((entry) => entry.slug)).toEqual([
      "series-1",
      "series-2",
      "series-3",
    ]);
    // Series posts never leak into topic paths.
    expect(paths[1]?.entries.map((entry) => entry.slug)).toEqual([
      "topic-1",
      "topic-2",
      "topic-3",
    ]);
  });

  it("excludes posts already shown elsewhere before grouping", () => {
    const paths = buildLearningPaths(
      [...seriesPosts, ...topicPosts],
      ["series-1", "topic-1"],
    );

    expect(paths).toHaveLength(2);
    expect(paths[0]?.meta).toBe("2-part series");
    expect(paths[0]?.entries.map((entry) => entry.slug)).toEqual([
      "series-2",
      "series-3",
    ]);
    expect(paths[1]?.entries.map((entry) => entry.slug)).toEqual([
      "topic-2",
      "topic-3",
    ]);
  });

  it("drops any path that cannot field at least two entries", () => {
    const paths = buildLearningPaths(
      [...seriesPosts, ...topicPosts],
      ["series-2", "series-3", "topic-2", "topic-3"],
    );

    expect(paths).toEqual([]);
  });

  it("keeps one post from appearing in two rendered paths", () => {
    const paths = buildLearningPaths([...seriesPosts, ...topicPosts]);
    const renderedSlugs = paths.flatMap((path) => path.entries.map((entry) => entry.slug));

    expect(new Set(renderedSlugs).size).toBe(renderedSlugs.length);
  });
});
