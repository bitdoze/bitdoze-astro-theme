---
name: bitdoze-astro-theme
description: Operate and extend the Bitdoze Astro blog theme in this repository. Use when an agent needs to add or edit posts, authors, pages, series, MDX widgets, branding, menus, contact settings, search, SEO, taxonomies, routes, accessibility, styling, tests, or build configuration for the Astro theme.
---

# Bitdoze Astro Theme

Maintain this Astro 7 and Tailwind CSS 4 theme without breaking its publication,
routing, SEO, or accessibility contracts.

## Start safely

1. Work from the repository root containing `astro.config.mjs` and
   `src/content.config.ts`.
2. Run `git status --short` before editing. Preserve unrelated user changes.
3. Read the files that own the requested behavior before changing it. Avoid
   duplicating configuration or collection queries.
4. Use `apply_patch` for edits.
5. Keep static rendering and minimal client JavaScript unless the task requires
   interactivity.

## Preserve these contracts

- Load publishable posts through `getPublishedPosts()` in
  `src/utils/content.ts`. Do not query the `posts` collection directly in
  public routes, RSS, search, widgets, or navigation.
- Treat a post as public only when `draft` is false and its `date` is not in the
  future. Keep this rule centralized in `src/utils/publication.ts`.
- Use `slug` only for the local route and `canonical` only for canonical
  metadata. Never derive a route from `canonical`.
- Generate post links with `getPostUrl()` and taxonomy paths with `slugify()`
  from `src/utils/slug.ts`.
- Preserve nested post paths. Keep page and author content flat because their
  loaders intentionally accept only top-level files.
- Keep posts out of reserved top-level routes such as `about`, `authors`,
  `blog`, `categories`, `contact`, `search`, `series`, and `tags`. The post
  route performs collision checks during the build.
- Let `src/layouts/Layout.astro` own the single `<main>` landmark. Use `div`,
  `section`, `article`, or `header` inside pages.
- Keep visible headings based on `title`; use `meta_title ?? title` for document
  metadata.
- Pass SEO data through `Layout.astro` to `SEO.astro`. Do not hand-write
  duplicate canonical, Open Graph, robots, or JSON-LD tags in pages.
- Keep interactive components keyboard operable with explicit labels, focus
  behavior, and synchronized ARIA state.

## Add or edit a post

Create Markdown or MDX under `src/content/posts/`. Use this shape:

```yaml
---
title: "Visible article title"
meta_title: "Optional search and social title"
description: "Required concise article description."
date: 2026-01-15
updatedDate: 2026-02-01
image: "../../assets/images/example.svg"
imageAlt: "Meaningful description of the image"
authors: ["dragos"]
categories: ["Web Development"]
tags: ["astro", "accessibility"]
series:
  name: "Astro Guide"
  position: 1
slug: "optional/custom-path"
canonical: "https://example.com/original/"
draft: false
featured: true
---
```

- Require `description`, `date`, `image`, and at least one author.
- Omit optional fields instead of inserting empty strings.
- Set `featured: true` to include a post in the homepage Featured Posts grid
  (up to three, newest first, never repeating the hero post).
- Keep series positions positive and unique within a series.
- Add a matching author entry before introducing a new author identifier.
- Put imported content images in `src/assets/images/`. Put URL-addressable,
  unprocessed files in `public/`.
- Use the components exported by
  `src/layouts/components/MarkdownComponents.astro` directly in MDX.

## Add authors or standalone pages

- Add authors as top-level files in `src/content/authors/`.
- Add generic standalone content as top-level files in `src/content/pages/`.
- Use valid absolute URLs for author social fields.
- Set `draft: true` to keep an author or page out of public collection helpers.
- Edit `src/content/about/index.md` for the About page rather than creating a
  competing `/about/` route.
- Do not create a generic page named after a reserved route or an existing post.

## Add or change an MDX widget

1. Place the component in `src/layouts/components/widgets/`.
2. Define typed Astro props.
3. Prefer native HTML semantics such as `details`, `button`, `nav`, and `time`.
4. Add client JavaScript only for behavior that HTML and CSS cannot provide.
5. Export the component from
   `src/layouts/components/MarkdownComponents.astro`.
6. Test pointer and keyboard behavior. For composite widgets, maintain roles,
   labels, selected/expanded state, focus order, and Escape or arrow-key
   behavior where appropriate.

Use Astro's `Image` component for imported images. Provide dimensions,
responsive `widths` and `sizes` for content images, lazy-load below-the-fold
media, and reserve eager/high-priority loading for likely LCP images.

## Customize the theme

- Edit `src/config/site.ts` for the title, brand name, logo, language, default
  metadata, hero/footer copy, pagination, and archive indexing policy.
- Edit `src/config/menu.json` for primary and footer navigation.
- Edit `src/config/social.json` for public social profiles. Leave unavailable
  profiles empty so they are omitted.
- Edit `src/config/config.json` for public contact details and the form endpoint.
  A `contact_form_action` value of `#` intentionally disables submission.
- Set `SITE_URL` in production. `astro.config.mjs` uses the Bitdoze URL only as
  a fallback.
- Update both light and dark states. Reuse theme tokens and include visible
  focus styles.

## Change routes, archives, search, or SEO

- Reuse `getPublishedPosts()`, `sortPostsByDate()`, `getPagination()`,
  `getPostUrl()`, and `slugify()` instead of copying their logic.
- Update every affected surface when changing a content URL: cards, RSS,
  search data, series navigation, related posts, breadcrumbs, sitemap policy,
  and tests.
- Keep noindexed archive pages as `noindex, follow` and out of the sitemap.
- Keep `robots.txt` generated by `src/pages/robots.txt.ts` so it follows
  `Astro.site`.
- Keep search results built with DOM APIs or otherwise escaped. Never nest
  interactive links or move focus automatically on page load.
- Add route and publication tests when changing path or visibility behavior.

## Style and layout

- Use mobile-first Tailwind utilities.
- Reuse the width and padding supplied by `Layout.astro`; avoid stacking extra
  horizontal containers without a visual reason.
- Keep article prose near 65–75 characters while allowing media and related
  content to use wider layouts.
- Check dark-mode contrast and `prefers-reduced-motion`.
- Account for the sticky header when adding anchor targets.

## Verify every change

Run the complete local gate:

```bash
npm run verify
```

This must finish with:

- `astro check`: zero errors, warnings, and hints.
- Vitest: all tests passing.
- Production build: successful static route generation.

Also run `git diff --check`.

For visual or interactive changes, start the built preview and inspect at least
one desktop and one 390px-wide mobile viewport. Verify the exact affected
interaction, keyboard behavior, accessible names/state, and browser console.
For dependency changes, run `npm audit` and avoid force-upgrading across major
versions without reviewing the resulting dependency and application changes.

## Hand off

Summarize the behavior changed, configuration the user must still provide,
files added or materially changed, and the verification commands that passed.
Do not claim deployment, staging, or commits unless those actions actually
occurred.
