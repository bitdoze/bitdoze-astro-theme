---
title: "Core Web Vitals in Practice: LCP, INP, and CLS"
meta_title: "Core Web Vitals Guide: How to Fix LCP, INP, and CLS"
description: "Understand what LCP, INP, and CLS measure, how field data differs from lab data, and the concrete fixes that move each metric."
date: 2026-08-04
featured: true
image: "../../assets/images/web-vitals.svg"
imageAlt: "Illustration of a performance gauge pointing to a good score"
authors: ["dragos"]
categories: ["Web Performance"]
tags: ["performance", "web-vitals", "seo", "web-development"]
---

Core Web Vitals are three numbers that describe how a page feels to load and use. They matter because they are measured from real visits, they feed into search ranking signals, and — more importantly — because each one maps to a specific kind of frustration. This guide is about fixing them, not memorizing their names.

## What Each Metric Measures

| Metric | Question it answers | Good | Needs work |
| --- | --- | --- | --- |
| LCP | When does the main content appear? | ≤ 2.5 s | > 4.0 s |
| INP | How quickly does the page respond to input? | ≤ 200 ms | > 500 ms |
| CLS | How much does the layout shift while loading? | ≤ 0.1 | > 0.25 |

Scores are evaluated at the 75th percentile: three quarters of visits must pass. A good average with a bad tail still fails.

## Field Data vs. Lab Data

Lighthouse runs a lab test on a simulated device. It is useful for finding problems, but it is not the score search engines use. Field data comes from real users:

- **CrUX** is Chrome's public dataset for popular sites, visible in PageSpeed Insights.
- **RUM** is your own telemetry. The `web-vitals` library makes it a few lines:

```javascript
import { onLCP, onINP, onCLS } from "web-vitals";

onLCP((metric) => console.log("LCP", metric.value));
onINP((metric) => console.log("INP", metric.value));
onCLS((metric) => console.log("CLS", metric.value));
```

Field data tells you *whether* users are happy; lab data tells you *why* they are not.

## Fixing LCP

LCP is usually one resource: a hero image, a background video, or a slow font blocking text.

- Serve the LCP image in a modern format (AVIF/WebP) and preload it.
- Mark the image `fetchpriority="high"` and never lazy-load it.
- Set explicit `width` and `height` so layout is not recalculated.
- Avoid client-side rendering for above-the-fold content; ship HTML.
- Self-host fonts, subset them, and use `font-display: swap`.

For most static sites, fixing the hero image alone moves LCP from "needs work" to "good."

## Fixing INP

INP replaced FID because it measures every interaction, not just the first. Long tasks on the main thread delay every click and keypress.

- Split long JavaScript tasks and yield to the browser between chunks.
- Hydrate only what is interactive, and hydrate lazily.
- Audit third-party scripts; one chat widget can dominate the main thread.
- Debounce expensive handlers and move work to a worker where possible.
- Test on a mid-range phone, not just your laptop.

## Fixing CLS

CLS is about space that was not reserved:

- Always set `width`/`height` or `aspect-ratio` on images, videos, and iframes.
- Reserve space for ads, embeds, and cookie banners.
- Avoid injecting content above existing content after load.
- Use `font-display: optional` or preload fonts to reduce swap shifts.

A single unsized image above the fold is the most common cause.

## Put a Budget in CI

A performance budget turns "we should be faster" into a build failure:

- LCP under 2.5 s on a simulated 4G connection.
- Total JavaScript under an agreed limit per route.
- No layout shift from images missing dimensions.

Run Lighthouse CI or a synthetic check on every pull request, and compare against the previous build rather than an absolute score.

## Conclusion

LCP is about priority, INP is about main-thread work, and CLS is about reserved space. Measure with field data, fix the dominant cause first, then guard the result with a budget. Performance stops being a project and becomes a property of the codebase.
