# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
