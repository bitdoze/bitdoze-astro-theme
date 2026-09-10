# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-09-10

A focused follow-up to 1.3.0: single-row card metadata, a tighter homepage structure, and a modern footer. No routing or content contracts changed.

### Fixed

- Post card metadata is now one text-first row (author · category, date pinned right) with a compact date format ("Aug 4, 2026"); long author names or categories truncate with a `title` tooltip instead of wrapping to a second row.

### Changed

- Homepage structure: Popular Topics moved directly below Featured Posts, and every homepage section now shares one left-aligned header style (`SectionHeader.astro`) with optional actions ("View all posts", "Browse series").
- Homepage rhythm: the hero and Learning paths now use the same full-width tinted band as Popular Topics, so the page alternates between white and tinted sections and the footer continues the band surface.
- Footer redesigned: tinted surface with a clearer column hierarchy, circular social buttons, larger post thumbnails, and a bottom bar with RSS and Back to top; the copyright now uses the brand name.

## [1.3.0] - 2026-09-10

A design-identity pass based on the 2026-09-10 design critique, plus expanded demo content, a Featured Posts section, and a brand-anchored accent ramp. Routing contracts are unchanged; the content schema gains one optional field (`featured`).

### Added

- **Brand-anchored accent ramp**: `accent-*` is now an owned azure scale anchored on the logo (`#009cef`) rather than a copy of Tailwind's default blue. Link, button, chip, and dark-mode pairs are enforced by the contrast test.
- **Display face for headings**: self-hosted `Bricolage Grotesque Variable` (`@fontsource-variable/bricolage-grotesque`) exposed as the `--font-display` token; body copy stays on the system stack.
- **Series anchors**: each series on `/series/` has an `id`, so series badges on cards link straight to their series entry.
- **Expanded demo content**: twelve new fully written posts with original SVG covers — Astro series Parts 4–5, two new series ("VPS Hosting for Developers", 4 parts, and "Blogging That Works", 3 parts), and standalone SEO, Core Web Vitals, and self-hosted analytics guides — plus the cover `introduction-to-cloud-computing` was missing.
- **Featured Posts section**: optional `featured` frontmatter flag and a `homepage.showFeaturedPosts` toggle. The homepage renders up to three editor's picks in the same three-column card grid as Latest, newest first, never repeating the hero post.
- **Popular Topics restored**: columns prefer posts not shown elsewhere on the page, then backfill with the tag's most recent posts so configured topics render on small archives; a post never appears in two columns.

### Changed

- **Homepage dedupe**: every surface owns a distinct slice of the archive (hero → latest non-series posts → series learning path → topic paths → Popular Topics), and Popular Topics drops columns with fewer than two unseen posts instead of repeating shown ones. Path building moved to `src/utils/learningPaths.ts`.
- **Card language**: one category chip in the meta row, series as a small label above the title, covers default to `imageFit: "contain"` so baked-in cover titles are never cropped, and image hover is a brightness shift instead of `scale-105`.
- **One content width**: header, footer, hero, and homepage sections share the same `max-w-5xl` container; the contact page no longer nests its own container.
- **Breadcrumbs**: middle crumbs collapse on mobile (`Home / current`), the current title truncates with an ellipsis instead of a hard clip, and the accent pill is now plain ink.
- **Focus and contrast fixes**: contact inputs use the global focus ring, "Follow along" text and the mobile TOC icon were corrected, footer headings are `h2`, and the nested TOC list gained inset padding.
- **Popular Topics subline** changed to "Browse posts by topic".

## [1.2.0] - 2026-09-09

A design release bringing the theme's reading and homepage experience in line with bitdoze.com: a sticky table-of-contents rail, a featured-post hero with learning paths, and a full token and card-language cleanup. No content or configuration contract changes.

### Added

- **Sticky TOC rail with mobile companion**: desktop right-rail table of contents with persisted collapse state and scrollspy highlighting, plus a floating action-button panel below `xl` with outside-click and Escape dismissal. Replaces the inline TOC box above the article.
- **Code copy buttons** on article code blocks, with clipboard-plus-fallback copying, copied/error states, and reduced-motion support.
- **Featured-post hero**: the newest post spotlights beside the headline, with a `Latest` chip, category, excerpt, author/date/reading-time meta, proof counts computed from real content, `Browse articles` and `Find your path` CTAs, and quiet social links. Falls back to a centered hero when the blog is empty.
- **Learning paths section**: real series in position order plus the three largest categories, each with numbered entry links and a start/browse call to action.
- **Author byline box** at the article end, with avatar, bio, and a link to more guides from the author.
- **Reading time and updated stamp** in the article meta line.
- **Branded text selection** in the accent tint for both themes.

### Changed

- **Article layout** follows the reference grid: `max-w-3xl` reading measure widening to a `16rem`/`18rem` TOC rail at `xl`/`2xl`, extrabold display title, description lede callout, bordered hero cover with rail-aware responsive sizes, and tags moved to the article end as capitalized pills.
- **Breadcrumb is a pill trail**: muted hairline container with hidden-scrollbar horizontal scroll, home icon, hover-wash links, and the current title as a truncated accent pill.
- **Related posts rebuilt on the reference design**: borderless whole-card links with zoom-on-hover covers, category badge, two-line title, and date-only meta.
- **Popular Topics ported to the reference design**: band section with title and subline, accent-underlined tag headers with count badges, divided rows with bordered 16:9 thumbnails, and `View all {tag} posts` footers. Columns prefer unshown posts and backfill from shown ones so small blogs never render a hollow section.
- **Homepage flow**: hero spotlight, Latest grid (featured post excluded, no repeats), learning paths, Explore cards, Popular Topics.
- **Prose polish**: wash-style links, console-bordered code blocks, inline code chips, balanced headings, 5.5rem anchor offset, and bordered tables with row hover.
- **Header is translucent** with backdrop blur; the search icon rests gray in dark mode.
- **Footer social icons** use a shared icon map (Bluesky, website, address) so a configured profile never renders a missing icon.
- **Notice callouts** use the full 1px tinted border and semantic `info`/`success`/`warning`/`danger` tokens instead of the side bar and literal colors.
- **Token sweep**: remaining literal `blue-*` interactive colors (pagination, breadcrumb, share buttons, progress bar, series nav, topic badges, hero) moved to the identical `accent-*` scale; cards share one language (hairline border, `shadow-sm`, lift on hover).
- **Reference image sizes everywhere**: card covers `640x360` with `widths [320, 480, 640]` and breakpoint `sizes`, related covers `400x225` (`[320, 400]`), list thumbnails `64x36`, hero feature `960x540`.

## [1.1.0] - 2026-09-09

A focused hardening release implementing the community review (`astro6-review.md`). Publishing safety, accessible interactions, a consistent configuration contract, and a CI release gate.

### Fixed

- **Table of contents no longer crashes valid Markdown**: leading H3, skipped heading levels, and body H1 build a sane TOC instead of failing the build; the TOC card is suppressed when empty. (R02)
- **Desktop navigation is disclosure-only**: the hover reveal was removed; the Pages button is the single opener with `aria-expanded`, Escape dismissal, and outside-click close. (R04)
- **Tabs are readable without JavaScript**: all panels render stacked in raw HTML; hiding of inactive panels happens only after enhancement. Full ARIA tab pattern (roving tabindex, Arrow/Home/End) retained. (R05)
- **Dark-mode contrast**: active tab labels, solid green buttons, and outline button variants now meet WCAG 1.4.3 (4.5:1) in both themes; author social links and TOC links carry accessible names. (R08)
- **Search state**: the URL clears with the input, back/forward stays in sync, the result count reports total matches (with a "Showing X of Y" notice past 12), and the page ships a `noscript` fallback. (R24)
- **Safe structured data and feeds**: all JSON-LD is emitted through a script-safe serializer (a literal `</script>` in a title can no longer break the page), and the unnamespaced raw `<tags>` RSS element was removed in favor of proper RSS categories. (R20, R22)
- **Taxonomy identity**: tags and categories dedupe by slugified identity (no more split `Astro`/`astro` sets), non-Latin labels get stable percent-encoded slugs instead of empty ones, and index chips, cards, and detail routes share one taxonomy helper. (R12)
- **Indexation is explicit**: robots meta is now an explicit per-route prop instead of pathname guessing, with `noindex, follow` semantics preserved; sitemap, robots.txt, and feed policies align, and no fake `lastmod` is emitted. (R20)

### Changed

- **Dependency upgrades**: Astro ^7.3.2, @astrojs/mdx ^8.0.1, Vite ^8.2.2, Tailwind CSS ^4.3.3 and related packages; `npm audit --omit=dev` reports no known vulnerabilities. (R11)
- **Homepage leads with reading**: Latest Articles now follows the hero, before a compact Explore row and optional, deduplicated Popular Topics sections. (R16)
- **Reading surface**: articles use a constrained measure, anchors clear the sticky header, covers render responsively with the correct eager/lazy split, and an optional `imageFit` (cover/contain) plus coverless posts are supported end to end. (R13, R17)
- **Configuration is the rebranding surface**: favicons, OG image, and homepage sections are configured in `src/config/site.ts` instead of hardcoded in layouts. (R10)
- **Semantic theme tokens**: accent and status colors are defined once and consumed by header, cards, buttons, tabs, and search, with a single global focus-visible style and 44px touch targets on header controls; theme persistence no longer breaks when storage is blocked. (R18)
- **One pagination implementation** shared by blog, tag, category, and author archives, with boundary tests; listing routes share one grid component and the footer reuses a shared latest-posts helper. (R14)
- **Authors resolve by entry ID** rather than display title, unknown authors warn and skip at build, and author images are validated as public-asset paths. Author archive URLs are now keyed on the entry ID slug. (R13)
- **YouTube embeds normalize any watch/share/embed/shorts URL** into a canonical embed URL with preserved start time, a no-JS watch link, and thumbnail-failure recovery; `Button` no longer silently falls back to `#`. (R25)
- **Documentation overhauled**: HTTPS/template-based install, corrected Tailwind v4 customization guidance, task-based onboarding, deployment and performance notes, search index limits, content-trust and security policy, and demo tutorial content matches the theme's actual architecture. (R09, R26)
- **Subpath hosting is supported** through Astro's `base` (verified by a `/theme/` smoke build); all code-constructed internal URLs flow through a single base-aware helper. (R15)

### Added

- **CI release gate** (`.github/workflows/ci.yml`): `npm ci`, `astro check`, vitest, production build, and a production-dependency audit on Node 22 and 24. (R27)
- **Regression tests** for TOC construction, YouTube URL parsing, JSON-LD serialization, taxonomy normalization, pagination boundaries, publication policy, and slug behavior. (R27)
- **`/widgets/` specimen page** demonstrating every widget plus a typography specimen, with typed widget prop contracts exported from the MDX component registry. (R25)
- **Social share copy-link** action and a 1200x630 raster OG card (`public/images/og-image.png`). (R21, R25)
- **Video metadata** can be declared per post and flows through to `VideoObject` structured data. (R19)
