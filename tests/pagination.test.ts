import { describe, expect, it } from "vitest";
import {
    getArchivePage,
    getPaginatedPageNumbers,
    getPagination,
} from "../src/utils/pagination";

const PAGE_SIZE = 3;
const BASE_PATH = "/blog";

// Test seam: getArchivePage is generic over the post shape and only slices
// the array it receives, so plain id markers prove slice boundaries.
const post = (n: number) => ({ id: n });
const posts = (count: number) => Array.from({ length: count }, (_, i) => post(i + 1));
const ids = (pagePosts: Array<{ id: number }>) => pagePosts.map((p) => p.id);

describe("getArchivePage boundaries", () => {
    it("renders one empty index page for 0 posts with no pager links or deeper routes", () => {
        const result = getArchivePage({
            page: 1,
            posts: posts(0),
            basePath: BASE_PATH,
            postsPerPage: PAGE_SIZE,
        });

        expect(result.totalPages).toBe(1);
        expect(result.currentPage).toBe(1);
        expect(result.pagePosts).toEqual([]);
        expect(result.prevUrl).toBeNull();
        expect(result.nextUrl).toBeNull();
        expect(getPaginatedPageNumbers(0, PAGE_SIZE)).toEqual([]);
    });

    it("renders the single post on page 1 for 1 post", () => {
        const result = getArchivePage({
            page: 1,
            posts: posts(1),
            basePath: BASE_PATH,
            postsPerPage: PAGE_SIZE,
        });

        expect(result.totalPages).toBe(1);
        expect(ids(result.pagePosts)).toEqual([1]);
        expect(result.prevUrl).toBeNull();
        expect(result.nextUrl).toBeNull();
        expect(getPaginatedPageNumbers(1, PAGE_SIZE)).toEqual([]);
    });

    it("fits exactly page-size posts on one page without a next link", () => {
        const result = getArchivePage({
            page: 1,
            posts: posts(PAGE_SIZE),
            basePath: BASE_PATH,
            postsPerPage: PAGE_SIZE,
        });

        expect(result.totalPages).toBe(1);
        expect(ids(result.pagePosts)).toEqual([1, 2, 3]);
        expect(result.nextUrl).toBeNull();
        expect(getPaginatedPageNumbers(PAGE_SIZE, PAGE_SIZE)).toEqual([]);
    });

    it("splits page-size+1 posts into a full first page and a second page", () => {
        const first = getArchivePage({
            page: 1,
            posts: posts(PAGE_SIZE + 1),
            basePath: BASE_PATH,
            postsPerPage: PAGE_SIZE,
        });

        expect(first.totalPages).toBe(2);
        expect(ids(first.pagePosts)).toEqual([1, 2, 3]);
        expect(first.nextUrl).toBe("/blog/page/2/");
        expect(first.prevUrl).toBeNull();

        const second = getArchivePage({
            page: 2,
            posts: posts(PAGE_SIZE + 1),
            basePath: BASE_PATH,
            postsPerPage: PAGE_SIZE,
        });

        expect(second.currentPage).toBe(2);
        expect(ids(second.pagePosts)).toEqual([4]);
        // Page 2 links back to the bare index route, not /page/1/
        expect(second.prevUrl).toBe("/blog");
        expect(second.nextUrl).toBeNull();
        expect(getPaginatedPageNumbers(PAGE_SIZE + 1, PAGE_SIZE)).toEqual([2]);
    });

    it("keeps a short remainder on the last page", () => {
        const total = PAGE_SIZE * 2 + 1; // 7 posts -> 3 pages of 3/3/1
        const page2 = getArchivePage({ page: 2, posts: posts(total), basePath: BASE_PATH, postsPerPage: PAGE_SIZE });
        const page3 = getArchivePage({ page: 3, posts: posts(total), basePath: BASE_PATH, postsPerPage: PAGE_SIZE });

        expect(page2.totalPages).toBe(3);
        expect(ids(page2.pagePosts)).toEqual([4, 5, 6]);
        expect(page2.nextUrl).toBe("/blog/page/3/");
        expect(page2.prevUrl).toBe("/blog");

        expect(ids(page3.pagePosts)).toEqual([7]);
        expect(page3.prevUrl).toBe("/blog/page/2/");
        expect(page3.nextUrl).toBeNull();
        expect(getPaginatedPageNumbers(total, PAGE_SIZE)).toEqual([2, 3]);
    });

    it("clamps an out-of-range page onto the last page", () => {
        const result = getArchivePage({
            page: 99,
            posts: posts(PAGE_SIZE + 1),
            basePath: BASE_PATH,
            postsPerPage: PAGE_SIZE,
        });

        expect(result.currentPage).toBe(2);
        expect(ids(result.pagePosts)).toEqual([4]);
    });
});

describe("getPagination math", () => {
    it("yields empty slice bounds for 0 posts", () => {
        const result = getPagination({ page: 1, totalPosts: 0, postsPerPage: PAGE_SIZE, basePath: BASE_PATH });
        expect(result.totalPages).toBe(1);
        expect(result.startIndex).toBe(0);
        expect(result.endIndex).toBe(0);
    });

    it("builds page URLs with a trailing slash under /page/N/", () => {
        const result = getPagination({ page: 2, totalPosts: PAGE_SIZE * 3, postsPerPage: PAGE_SIZE, basePath: BASE_PATH });
        expect(result.prevUrl).toBe("/blog");
        expect(result.nextUrl).toBe("/blog/page/3/");
        expect(result.startIndex).toBe(PAGE_SIZE);
        expect(result.endIndex).toBe(PAGE_SIZE * 2);
    });

    it("accepts a base path that already ends with a slash", () => {
        const result = getPagination({ page: 1, totalPosts: PAGE_SIZE + 1, postsPerPage: PAGE_SIZE, basePath: "/tags/astro/" });
        expect(result.nextUrl).toBe("/tags/astro/page/2/");
    });
});
