export function slugify(value: string): string {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ContentEntryLike = {
  id?: string;
  slug?: string;
  data: {
    slug?: string;
  };
};

export function entryIdToSlug(entry: { id?: string; slug?: string }): string {
  const id = entry.slug || entry.id || "";
  const lastSegment = id.split("/").filter(Boolean).pop() || id;
  return lastSegment.replace(/\.(md|mdx)$/i, "");
}

export function entryIdToPath(entry: { id?: string; slug?: string }): string {
  const id = entry.slug || entry.id || "";
  return id
    .replace(/\.(md|mdx)$/i, "")
    .split("/")
    .filter(Boolean)
    .map(slugify)
    .join("/");
}

export function getPostSlug(post: ContentEntryLike): string {
  return post.data.slug
    ? entryIdToPath({ id: post.data.slug })
    : entryIdToPath(post);
}

// Root-relative URL of a post, already carrying the deploy base. The base
// prefix comes from withBase() so every post link shares one construction
// point; at the default base "/" the output is unchanged.
export function getPostUrl(post: ContentEntryLike): string {
  return withBase(`/${getPostSlug(post)}/`);
}

// Prepend the configured deploy base (import.meta.env.BASE_URL) to an
// internal, root-relative path. External URLs, protocol-relative URLs and
// hash/query-only references pass through untouched; at the default base
// "/" the path is returned unchanged, so root deployments keep
// byte-identical URLs. The path's own trailing slash is preserved.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") {
    return path;
  }
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(path)) {
    return path;
  }
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export type TaxonomyEntry = {
  slug: string;
  label: string;
};

// Fallback identity for labels the ASCII slugifier reduces to "": RFC 3986
// percent-encoding of the trimmed label. Deterministic for a given label
// (stable across sets and builds), injective (distinct labels never merge),
// and URL-safe for any Unicode input.
function percentEncodeSlug(label: string): string {
  return encodeURIComponent(label.trim()).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

// Route identity for a taxonomy label: slugify when it produces something,
// otherwise the percent-encoded fallback. Throws an actionable error when
// even the fallback cannot produce a slug (empty/whitespace-only label).
export function taxonomySlug(label: string): string {
  const slug = slugify(label) || percentEncodeSlug(label);
  if (!slug) {
    throw new Error(
      `[taxonomy] Cannot derive a route slug for the label "${label}". Use a non-empty tag/category name.`,
    );
  }
  return slug;
}

// Normalize raw taxonomy labels into route identities: one entry per unique
// slug (so "Astro" and "astro" merge), keeping the first raw label for
// display. Preserves first-occurrence order and never emits an empty slug.
export function normalizeTaxonomy(labels: string[]): TaxonomyEntry[] {
  const labelBySlug = new Map<string, string>();
  for (const label of labels) {
    const slug = taxonomySlug(label);
    if (!labelBySlug.has(slug)) {
      labelBySlug.set(slug, label);
    }
  }
  return [...labelBySlug].map(([slug, label]) => ({ slug, label }));
}
