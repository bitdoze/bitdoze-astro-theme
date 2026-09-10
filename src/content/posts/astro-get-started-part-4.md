---
title: "Getting Started with Astro - Part 4: Islands and Interactive Components"
meta_title: "Astro Islands and Client Directives: A Practical Guide"
description: "Learn how Astro islands work, how the client directives control hydration, and how to add interactivity without shipping unnecessary JavaScript."
date: 2026-03-17
image: "../../assets/images/astro-islands.svg"
imageAlt: "Illustration of isolated interactive components on a static page"
authors: ["dragos"]
categories: ["Web Development"]
tags: ["astro", "jamstack", "islands", "javascript"]
series:
  name: "Astro Get Started"
  position: 4
---

Parts 1 through 3 covered the basics: pages, components, content collections, and deployment. The question that comes next is usually some version of "how do I make things interactive?" In most frameworks the answer is "hydrate the page." In Astro the answer is "hydrate the island."

## What an Island Actually Is

An island is a self-contained interactive component inside an otherwise static page. Astro renders the entire page to HTML on the server, including a first render of each island. For islands that opt in, a small script then wakes that component up in the browser with its own state and event handlers.

That model has two practical consequences:

- Content that never changes does not ship JavaScript at all.
- Each island hydrates independently, so a slow component cannot delay the rest of the page.

The architecture works because most pages are mostly static. A pricing table, an article, and a footer do not need a client runtime. The search box and the theme toggle do.

## Start Without a Framework

Before reaching for React or Svelte, check whether a plain script is enough. Astro processes `<script>` tags in components automatically:

```astro
---
const topics = ["astro", "vps", "seo"];
---

<ul id="topic-list">
  {topics.map((topic) => <li data-topic={topic}>{topic}</li>)}
</ul>

<input id="topic-filter" type="search" placeholder="Filter topics" />

<script>
  const input = document.querySelector<HTMLInputElement>("#topic-filter");
  const items = document.querySelectorAll<HTMLElement>("[data-topic]");

  input?.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    items.forEach((item) => {
      item.hidden = !item.dataset.topic?.includes(query);
    });
  });
</script>
```

Astro bundles component scripts, deduplicates them, and loads them once per page. Adding the same script to twenty cards does not add twenty copies. Use `is:inline` only when you need the browser to execute the code exactly where it appears.

## Client Directives, Explained

Framework components are static by default. They render to HTML and stop. To make one interactive you add a client directive, and the directive you choose is a performance decision:

| Directive | When the component hydrates |
| --- | --- |
| `client:load` | Immediately, as soon as the page loads |
| `client:idle` | After the page becomes idle |
| `client:visible` | When the component scrolls into view |
| `client:media` | When a CSS media query matches |
| `client:only` | Skipped on the server, rendered in the browser |

The default should be the laziest directive that still feels right. A comment section below an article is a textbook `client:visible`. A theme toggle that controls the whole page is `client:load`. A mobile-only navigation drawer can use `client:media="(max-width: 768px)"`.

## Framework Components

Islands can be written in React, Preact, Svelte, Vue, Solid, or Svelte — but the integration is opt-in. Adding React looks like this:

```bash
npx astro add react
```

Then any `.jsx` or `.tsx` component in `src/components` can be imported into an `.astro` file:

```astro
---
import Counter from "../components/Counter";
---

<!-- Static: no JavaScript ships -->
<Counter />

<!-- Interactive: ships the component and its framework runtime -->
<Counter client:visible />
```

Keep the interactive surface small. The best island is a leaf component with a narrow job, not a page-sized widget with hydration bolted on.

## Server Islands

Regular islands hydrate content that was already rendered. Server islands do the reverse: they render on demand, after the page has been sent to the browser, and stream into a placeholder. They are useful for personalization, live counts, or any fragment that must not be cached with the rest of the page.

```astro
---
import VisitorCount from "../components/VisitorCount.astro";
---

<VisitorCount server:defer>
  <p slot="fallback">Loading visits...</p>
</VisitorCount>
```

Server islands need an SSR adapter because they execute at request time. If your site is fully static, you do not need them yet.

## Measure What You Ship

Two habits keep island-based sites fast:

1. **Watch the build output.** `astro build` lists the JavaScript for each route. A page that grew by a framework runtime should be a conscious choice.
2. **Audit before shipping.** The Astro dev toolbar and Lighthouse both show how much script a page loads. If a component is interactive but never used on mobile, make it conditional with `client:media`.

## Conclusion

Islands are not a feature you sprinkle on at the end; they are a way of deciding what deserves interactivity. Render everything static, then promote individual components with the least eager `client:` directive that works. In Part 5 we will cover the last mile: SEO, sitemaps, and feeds for the site you just built.
