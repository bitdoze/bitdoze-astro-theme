import { describe, expect, it } from "vitest";
import { safeJsonLd } from "../src/utils/serialize";

describe("safeJsonLd", () => {
  it("escapes script-closing markup so the literal sequence never appears", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Fixing </script><script>alert(1)</script> in titles",
    };

    const payload = safeJsonLd(schema);

    expect(payload.includes("</script>")).toBe(false);
    expect(JSON.parse(payload)).toEqual(schema);
  });

  it("escapes U+2028/U+2029 line separators", () => {
    const schema = { description: "line\u2028sep\u2029par" };

    const payload = safeJsonLd(schema);

    expect(payload.includes("\u2028")).toBe(false);
    expect(payload.includes("\u2029")).toBe(false);
    expect(JSON.parse(payload)).toEqual(schema);
  });

  it("round-trips ordinary JSON-LD payloads unchanged", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com/" },
        { "@type": "ListItem", position: 2, name: "a<b & c", item: "https://example.com/x/" },
      ],
    };

    expect(JSON.parse(safeJsonLd(schema))).toEqual(schema);
  });
});
