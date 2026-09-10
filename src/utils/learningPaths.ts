import type { PostEntry } from "./content";
import { getPostSlug, getPostUrl, normalizeTaxonomy, taxonomySlug, withBase } from "./slug";

export type LearningPathEntry = {
  slug: string;
  title: string;
  url: string;
};

export type LearningPath = {
  kind: "series" | "topic";
  name: string;
  meta: string;
  entries: LearningPathEntry[];
  cta: string;
  ctaUrl: string;
};

const toEntry = (post: PostEntry): LearningPathEntry => ({
  slug: getPostSlug(post),
  title: post.data.title,
  url: getPostUrl(post),
});

/**
 * Builds the homepage Learning Paths from published posts.
 *
 * `excludeSlugs` holds posts already shown elsewhere on the page (hero, latest
 * grid). Series paths are grouped from the remaining posts and need at least
 * two parts to be a path; topic paths are built from remaining non-series
 * posts and likewise need at least two entries. Keeping this logic in one
 * place lets the homepage compute every slug it renders and pass the full set
 * to later sections, so a post never appears twice on the page.
 */
export function buildLearningPaths(
  posts: PostEntry[],
  excludeSlugs: string[] = [],
): LearningPath[] {
  const excluded = new Set(excludeSlugs);
  const available = posts.filter((post) => !excluded.has(getPostSlug(post)));

  // Series paths: parts in position order, CTA starts at Part 1.
  const seriesGroups = new Map<string, PostEntry[]>();
  for (const post of available) {
    const series = post.data.series;
    if (!series) continue;
    const group = seriesGroups.get(series.name) ?? [];
    group.push(post);
    seriesGroups.set(series.name, group);
  }
  const seriesPaths: LearningPath[] = [...seriesGroups.entries()]
    .map(([name, group]) => {
      const parts = [...group]
        .sort((a, b) => (a.data.series?.position ?? 0) - (b.data.series?.position ?? 0))
        .map(toEntry);
      return {
        kind: "series" as const,
        name,
        meta: `${parts.length}-part series`,
        entries: parts.slice(0, 3),
        cta: "Start with Part 1",
        ctaUrl: parts[0]?.url ?? withBase("/series/"),
      };
    })
    .filter((path) => path.entries.length >= 2);

  // Topic paths: the three largest categories, newest available posts first.
  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    for (const category of post.data.categories ?? []) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
  }
  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3);
  const labelBySlug = new Map(
    normalizeTaxonomy(topCategories.map(([label]) => label)).map((t) => [t.slug, t.label]),
  );
  const topicPool = available.filter((post) => !post.data.series);
  const topicPaths: LearningPath[] = topCategories
    .map(([category, count]) => {
      const slug = taxonomySlug(category);
      const entries = topicPool
        .filter((post) => post.data.categories?.some((c) => taxonomySlug(c) === slug))
        .slice(0, 3)
        .map(toEntry);
      return {
        kind: "topic" as const,
        name: labelBySlug.get(slug) ?? category,
        meta: `${count} ${count === 1 ? "guide" : "guides"}`,
        entries,
        cta: "Browse the topic",
        ctaUrl: withBase(`/categories/${slug}/`),
      };
    })
    .filter((path) => path.entries.length >= 2);

  return [...seriesPaths, ...topicPaths];
}
