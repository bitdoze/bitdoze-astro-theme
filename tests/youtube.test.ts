import { describe, expect, it } from "vitest";
import { parseYouTubeId } from "../src/utils/youtube";

const ID = "dQw4w9WgXcQ";

describe("parseYouTubeId", () => {
    it("parses every accepted URL form and the bare id", () => {
        const forms = [
            `https://www.youtube.com/watch?v=${ID}`,
            `https://youtube.com/watch?v=${ID}`,
            `https://m.youtube.com/watch?v=${ID}`,
            `https://www.youtube.com/share?v=${ID}`,
            `https://www.youtube.com/embed/${ID}`,
            `https://www.youtube.com/shorts/${ID}`,
            `https://www.youtube.com/live/${ID}`,
            `https://www.youtube-nocookie.com/embed/${ID}`,
            `https://youtu.be/${ID}`,
            `https://youtu.be/${ID}?si=shared-tag`,
            ID,
            `  ${ID}  `,
        ];
        for (const form of forms) {
            expect(parseYouTubeId(form)).toEqual({ id: ID });
        }
    });

    it("preserves start seconds from start= and t=, including compact durations", () => {
        expect(parseYouTubeId(`https://www.youtube.com/watch?v=${ID}&start=30`)).toEqual({
            id: ID,
            start: 30,
        });
        expect(parseYouTubeId(`https://www.youtube.com/watch?v=${ID}&t=30`)).toEqual({
            id: ID,
            start: 30,
        });
        expect(parseYouTubeId(`https://youtu.be/${ID}?t=30s`)).toEqual({ id: ID, start: 30 });
        expect(parseYouTubeId(`https://www.youtube.com/embed/${ID}?start=1m30s`)).toEqual({
            id: ID,
            start: 90,
        });
        expect(parseYouTubeId(`https://www.youtube.com/watch?v=${ID}&t=2h5m`)).toEqual({
            id: ID,
            start: 7500,
        });
    });

    it("resolves conflicting start/t params to a single canonical start", () => {
        const parsed = parseYouTubeId(`https://www.youtube.com/watch?v=${ID}&t=90&start=30`);
        expect(parsed).toEqual({ id: ID, start: 30 });
        expect(Object.keys(parsed ?? {}).filter((key) => key === "start")).toHaveLength(1);
    });

    it("cannot produce an embed URL with a doubled query separator", () => {
        const forms = [
            `https://www.youtube.com/watch?v=${ID}&start=30`,
            `https://www.youtube.com/watch?v=${ID}&t=30`,
            `https://youtu.be/${ID}?t=30`,
            `https://www.youtube.com/embed/${ID}?start=45`,
            `https://www.youtube.com/watch?v=${ID}&t=90&start=30`,
            `https://www.youtube.com/watch?v=${ID}`,
            ID,
        ];
        for (const form of forms) {
            const parsed = parseYouTubeId(form);
            expect(parsed).not.toBeNull();
            const start = parsed?.start === undefined ? "" : `?start=${parsed.start}`;
            const embedSrc = `https://www.youtube.com/embed/${parsed?.id}${start}`;
            expect(embedSrc.indexOf("?")).toBe(embedSrc.lastIndexOf("?"));
        }
    });

    it.each([
        "",
        "   ",
        "example1",
        "not a url",
        "javascript:alert(1)",
        "https://vimeo.com/12345678901",
        `https://youtube.com.evil.example/watch?v=${ID}`,
        "https://www.youtube.com/watch",
        `https://www.youtube.com/watch?e=${ID}`,
        "https://www.youtube.com/watch?v=short",
        "https://youtu.be/",
        "https://www.youtube.com/embed/",
        "https://www.youtube.com/playlist?list=PL1234567890a",
        "ftp://youtu.be/dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=never",
    ])("rejects %j", (input) => {
        expect(parseYouTubeId(input)).toBeNull();
    });
});
