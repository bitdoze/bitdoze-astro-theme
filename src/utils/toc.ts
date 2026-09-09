export type TocItem = {
  depth: number;
  slug: string;
  text: string;
  subheadings: TocItem[];
};

export type TocHeadingInput = {
  depth: number;
  slug: string;
  text: string;
};

/**
 * Build a nested table of contents from a flat heading list.
 * Includes depths 2-3 only; a depth-3 heading attaches to the nearest
 * preceding depth-2 heading, or is promoted to root if none exists.
 * Never throws on any input order (leading H3, skipped levels, duplicates).
 */
export function buildToc(headings: TocHeadingInput[]): TocItem[] {
  const toc: TocItem[] = [];
  let lastDepth2: TocItem | undefined;
  for (const h of headings) {
    if (h.depth !== 2 && h.depth !== 3) continue;
    const item: TocItem = {
      depth: h.depth,
      slug: h.slug,
      text: h.text,
      subheadings: [],
    };
    if (h.depth === 2) {
      toc.push(item);
      lastDepth2 = item;
    } else if (lastDepth2) {
      lastDepth2.subheadings.push(item);
    } else {
      toc.push(item);
    }
  }
  return toc;
}
