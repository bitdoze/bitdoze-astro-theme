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
    canonical?: string;
  };
};

export function entryIdToSlug(entry: { id?: string; slug?: string }): string {
  const id = entry.slug || entry.id || "";
  const lastSegment = id.split("/").filter(Boolean).pop() || id;
  return lastSegment.replace(/\.(md|mdx)$/i, "");
}

export function getPostSlug(post: ContentEntryLike): string {
  const fallbackSlug = entryIdToSlug(post);

  if (!post.data.canonical) {
    return fallbackSlug;
  }

  try {
    return new URL(post.data.canonical).pathname.split("/").filter(Boolean).pop() || fallbackSlug;
  } catch {
    return fallbackSlug;
  }
}

export function getPostUrl(post: ContentEntryLike): string {
  return `/${getPostSlug(post)}/`;
}
