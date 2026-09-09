// Single pagination implementation for every listing route (blog, tag,
// category, author archives and their /page/N/ variants). Pure unit: the
// page size is always passed explicitly so route components bind it to
// siteConfig.postsPerPage at their own edge.
import { withBase } from "./slug";

export interface PaginationProps {
  page: number;
  totalPosts: number;
  postsPerPage: number;
  basePath: string;
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  prevUrl: string | null;
  nextUrl: string | null;
}

export function getPagination({
  page,
  totalPosts,
  postsPerPage,
  basePath,
}: PaginationProps): PaginationResult {
  // An empty archive still renders one (empty) index page
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

  // Ensure page is within valid range
  const currentPage = Math.min(Math.max(1, page), totalPages);

  // Calculate start and end indices for slicing the posts array
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, totalPosts);

  // Page 1 links back to the index route itself; deeper pages live under
  // /page/N/ (matching the index + page/[page] route pairs). withBase()
  // attaches the deploy base here, at the single URL construction point.
  const pageUrl = (targetPage: number): string => {
    if (targetPage === 1) {
      return withBase(basePath);
    }
    const base = `${basePath}${basePath.endsWith("/") ? "" : "/"}`;
    return withBase(`${base}page/${targetPage}/`);
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    prevUrl: currentPage > 1 ? pageUrl(currentPage - 1) : null,
    nextUrl: currentPage < totalPages ? pageUrl(currentPage + 1) : null,
  };
}

export interface ArchivePageProps<T> {
  page: number;
  posts: readonly T[];
  basePath: string;
  postsPerPage: number;
}

export interface ArchivePageResult<T> {
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
  pagePosts: T[];
  prevUrl: string | null;
  nextUrl: string | null;
}

// Route-level pagination: everything an archive page needs — the post slice
// for the current page plus the pagination metadata — in one call, so index
// and /page/N/ routes of a pair cannot drift apart.
export function getArchivePage<T>({
  page,
  posts,
  basePath,
  postsPerPage,
}: ArchivePageProps<T>): ArchivePageResult<T> {
  const { currentPage, totalPages, startIndex, endIndex, prevUrl, nextUrl } = getPagination({
    page,
    totalPosts: posts.length,
    postsPerPage,
    basePath,
  });

  return {
    currentPage,
    totalPages,
    postsPerPage,
    pagePosts: posts.slice(startIndex, endIndex),
    prevUrl,
    nextUrl,
  };
}

// Route params for a [page].astro sibling: page 1 is handled by the index
// route, so getStaticPaths only generates 2..totalPages.
export function getPaginatedPageNumbers(totalPosts: number, postsPerPage: number): number[] {
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => i + 2);
}
