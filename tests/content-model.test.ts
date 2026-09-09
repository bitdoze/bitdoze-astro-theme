import { describe, expect, it, vi } from "vitest";
import { resolveAuthor, warnUnknownAuthor } from "../src/utils/authors";

const authors = [
  { id: "dragos.md", data: { title: "Dragos" } },
  { id: "team/jane.md", data: { title: "Jane Doe" } },
];

describe("author resolution", () => {
  it("resolves identifiers by entry id even when the display title differs", () => {
    const renamed = [{ id: "dragos.md", data: { title: "Dragos Bitdoze" } }];
    expect(resolveAuthor("dragos", renamed)).toMatchObject({ id: "dragos.md" });
    expect(resolveAuthor("Dragos Bitdoze", renamed)).toBeUndefined();
  });

  it("resolves nested entry ids by their last segment", () => {
    expect(resolveAuthor("jane", authors)).toMatchObject({
      id: "team/jane.md",
    });
  });

  it("normalizes case and separators in identifiers", () => {
    expect(resolveAuthor("JANE", authors)).toMatchObject({
      id: "team/jane.md",
    });
    expect(resolveAuthor(" jane ", authors)).toMatchObject({
      id: "team/jane.md",
    });
  });

  it("does not treat display titles as author references", () => {
    expect(resolveAuthor("Jane Doe", authors)).toBeUndefined();
  });

  it("returns undefined for empty or blank identifiers", () => {
    expect(resolveAuthor("", authors)).toBeUndefined();
    expect(resolveAuthor("   ", authors)).toBeUndefined();
  });

  it("warns on unknown author references instead of failing silently", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    warnUnknownAuthor("ghost");
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("No author entry matches"),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("src/content/authors"),
    );
    warn.mockRestore();
  });
});
