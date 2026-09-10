---
title: "Getting Started with Astro - Part 5: SEO, Sitemaps, and RSS"
meta_title: "Astro SEO Guide: Sitemaps, RSS Feeds, and Metadata"
description: "Give search engines and readers everything they need: canonical metadata, sitemaps, RSS feeds, robots.txt, and structured data for an Astro site."
date: 2026-03-31
image: "../../assets/images/astro-seo.svg"
imageAlt: "Illustration of a magnifying glass reviewing a page outline"
authors: ["dragos"]
categories: ["Web Development"]
tags: ["astro", "seo", "rss", "sitemap"]
series:
  name: "Astro Get Started"
  position: 5
---

A fast Astro site still needs to tell search engines what it is. The good news is that most SEO work on a static site is configuration rather than content marketing. This final part of the series covers the pieces that belong in the build.

## Metadata That Matters

Every page needs a unique, descriptive title and a one-sentence description. In Astro you pass them into a single layout component instead of repeating them in every page:

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
</head>
```

Two rules prevent most duplicate-content problems:

- **One page, one canonical URL.** If the same post is reachable at two paths, every copy points at the canonical one.
- **One page, one `<h1>`.** The visible heading is the page title; the document `<title>` can be slightly more descriptive.

## Sitemaps

The `@astrojs/sitemap` integration generates `sitemap-index.xml` at build time:

```bash
npx astro add sitemap
```

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap()],
});
```

The `site` option is not optional — without it the sitemap cannot emit absolute URLs. If some routes should not be indexed, filter them out with the `filter` option rather than leaving them in and hoping.

## An RSS Feed

RSS is still the cheapest distribution channel a blog can offer. With `@astrojs/rss` the whole feed is one endpoint:

```typescript
// src/pages/rss.xml.ts
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return rss({
    title: "Example Blog",
    description: "Practical guides for developers",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/${post.id}/`,
    })),
  });
}
```

Then add `<link rel="alternate" type="application/rss+xml" href="/rss.xml">` to the layout head so readers can discover it automatically.

## Robots and Structured Data

`robots.txt` should follow the same `site` value as the sitemap. Generate it at build time so a staging deployment cannot accidentally advertise the production host. For content pages, add JSON-LD so search engines understand the page type:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Getting Started with Astro",
  "datePublished": "2026-03-31",
  "author": { "@type": "Person", "name": "Dragos" }
}
</script>
```

Escape the payload before injecting it into the page, and keep the data in one utility so every post emits the same shape.

## Social Cards

Open Graph images should be 1200×630 and consistent across posts. You can design one per post, set a site-wide default, or generate them at build time from the post title. Whichever you choose, test the result with a link preview tool instead of assuming it works.

## A Pre-Launch Checklist

- Unique `<title>` and `<meta name="description">` on every route.
- Canonical URL on every page, including paginated archives.
- Sitemap generated and referenced in `robots.txt`.
- RSS feed linked from the head.
- `noindex` on thin archive pages you do not want ranked.
- JSON-LD for articles, breadcrumbs, and the site itself.
- A 1200×630 social card, verified with a preview tool.
- Redirects for any URL you moved.

## Conclusion

That closes the five-part Astro series. You can now build a project, model content, deploy it, add interactivity where it earns its place, and give search engines a clean picture of the result. The next step is the one no tutorial can do for you: publish something.
