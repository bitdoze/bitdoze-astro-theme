import { entryIdToSlug, slugify } from "./slug";

export type AuthorEntryLike = {
  id?: string;
  slug?: string;
  data: {
    title: string;
  };
};

// Authors are referenced by entry id (src/content/authors/<id>.md), never by
// display title: titles are editable copy, entry ids are stable references.
export function resolveAuthor<AuthorEntry extends AuthorEntryLike>(
  identifier: string,
  authors: AuthorEntry[],
): AuthorEntry | undefined {
  const target = slugify(identifier);
  if (!target) {
    return undefined;
  }
  return authors.find((author) => slugify(entryIdToSlug(author)) === target);
}

export function warnUnknownAuthor(identifier: string): void {
  console.warn(
    `[content] No author entry matches "${identifier}". Authors resolve by entry id (src/content/authors/<id>.md); add the entry or fix the frontmatter reference.`,
  );
}
