import { getCollection, type CollectionEntry } from "astro:content";
import { isPublishedPost } from "./publication";

export type PostEntry = CollectionEntry<"posts">;

export async function getPublishedPosts(now = new Date()): Promise<PostEntry[]> {
  const posts = await getCollection("posts");
  return posts.filter((post) => isPublishedPost(post, now));
}

export async function getPublishedPages() {
  return (await getCollection("pages")).filter((page) => !page.data.draft);
}

export async function getPublishedAuthors() {
  return (await getCollection("authors")).filter((author) => !author.data.draft);
}

export function sortPostsByDate(posts: PostEntry[]): PostEntry[] {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

// Latest posts for widgets (e.g. the footer): sort + slice in one place so
// consumers never re-implement the ordering.
export async function getLatestPosts(count: number, now = new Date()): Promise<PostEntry[]> {
  return sortPostsByDate(await getPublishedPosts(now)).slice(0, count);
}
