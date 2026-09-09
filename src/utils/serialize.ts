// Trust boundary: repository MDX and config are trusted build input. This
// escaping defends against markup-breaking content (e.g. a literal `</script>`
// inside a title), not hostile authors. A future external CMS or
// user-submission feature needs a different ingestion/security boundary.

/**
 * Serialize structured data for safe embedding in an HTML `<script type="application/ld+json">` block.
 *
 * JSON.stringify leaves `<`, U+2028 and U+2029 untouched; all three can break
 * out of the script context or the HTML document, so they are escaped as
 * JSON unicode escapes that parse back to the original characters.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
