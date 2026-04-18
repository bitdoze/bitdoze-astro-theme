---
title: "Cloudflare KV: Building a Tiny Edge Key-Value API"
meta_title: "Cloudflare KV: Building a Tiny Edge Key-Value API"
description: "Learn how to build a Cloudflare Worker with Hono and Workers KV to cache GitHub API responses at the edge with a one-hour TTL."
date: 2026-04-18
image: "../../assets/images/cloudflare-worker.png"
authors: ["hieupn"]
categories: ["Web Development"]
tags: ["cloudflare", "edge computing", "kv", "hono", "typescript", "caching"]
series: ["Cloudflare Workers", "2"]
---
This post walks through building a small but practical Cloudflare Worker: a caching proxy for the GitHub Repos API. The Worker intercepts requests for a GitHub username, checks Workers KV for a cached response, and only calls GitHub if the cache is cold. Repeat requests within the same hour are served entirely from the edge.

## What Is Workers KV?

Workers KV is Cloudflare's globally replicated key-value store. It lives at the edge alongside your Worker code, which means reads happen in the same data center that handles the request — no round-trip to a separate database region. Keys hold up to 25 MB of data and support an optional TTL so stale entries expire automatically. KV is optimized for high read volumes and is a natural fit for response caching, feature flags, and configuration.

## Why Developers Use It

- Reads are served from the edge, so they add almost no latency to a response.
- TTL-based expiration keeps the cache fresh without manual cleanup.
- The binding model means KV is available in the Worker as a plain JavaScript object — no SDK setup.
- Free-tier quotas are generous enough to cover hobby projects and low-traffic APIs.
- Tight integration with Wrangler makes local development and deployment straightforward.

## Key Concepts

### KV Namespaces and Bindings

A KV namespace is an isolated storage bucket. You create one with Wrangler and then declare a `binding` in `wrangler.jsonc`. The binding name becomes the property name on the `env` object inside the Worker, so `CACHE` in config becomes `c.env.CACHE` in code.

### TTL-Based Cache Invalidation

When you write a key with `expirationTtl`, Cloudflare automatically deletes it after the specified number of seconds. In this project every GitHub response is stored with `expirationTtl: 60 * 60` (one hour). No background job or manual purge is needed.

### Hono as the Router

[Hono](https://hono.dev/) is a lightweight TypeScript web framework that runs on Cloudflare Workers. It provides express-style routing with typed context. The `Bindings` generic lets TypeScript understand what `c.env` contains, giving you autocomplete and compile-time safety on KV calls.

## How It Works

1. A request arrives at `GET /:username`.
2. The Worker reads `username` from the route parameter.
3. It calls `c.env.CACHE.get(username)` to look up a cached entry.
4. If the cache is warm (`cachedResp` is not null), the Worker parses the stored JSON and returns it immediately.
5. On a cache miss, the Worker fetches `https://api.github.com/users/:username/repos` with appropriate headers.
6. The response JSON is stringified and written to KV with a one-hour TTL via `c.env.CACHE.put(username, ..., { expirationTtl: 3600 })`.
7. The fresh data is returned to the caller.

## Getting Started

You need Node.js 18+, a Cloudflare account, and npm.

```bash
# Scaffold a new Worker project
npm create cloudflare@latest -- cloudflare-api-kv
# When prompted: Hello World example → Worker only → TypeScript → No deploy

cd cloudflare-api-kv

# Add Hono
npm install hono

# Authenticate Wrangler with your Cloudflare account
npx wrangler login

# Create the KV namespace — copy the returned id into wrangler.jsonc
npx wrangler kv namespace create CACHE

# Generate TypeScript types for bindings
npm run cf-typegen

# Start the local dev server
npm run dev
```

The dev server listens on `http://localhost:8787`. With `"remote": true` in `wrangler.jsonc`, reads and writes during development go directly to the production KV namespace rather than a local simulation.

## Example: wrangler.jsonc Binding

Before writing any Worker code, the KV namespace must be declared in `wrangler.jsonc`. Notice the three required fields: `binding` sets the property name on `env`, `id` identifies the namespace, and `remote: true` opts into live KV access during `wrangler dev`.

```jsonc
{
  "name": "cloudflare-api-kv",
  "main": "src/index.ts",
  "compatibility_date": "2026-04-18",
  "compatibility_flags": ["nodejs_compat"],
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "36e6e38a54a9341f4967b78cefvlxx889",
      "remote": true
    }
  ]
}
```

## Example: The Worker — src/index.ts

The entire application lives in a single file. Notice how the `Env` interface maps the `CACHE` binding to the `KVNamespace` type, and how the cache-check-then-fetch pattern is expressed in about ten lines of TypeScript.

```typescript
import { Hono } from "hono";

export interface Env {
  CACHE: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.text("Server is running!!!!"));

app.get("/:username", async (c) => {
  const { username } = c.req.param();

  const cachedResp = await c.env.CACHE.get(username);
  if (cachedResp) {
    console.log("Cache hit for", username);
    return c.json(JSON.parse(cachedResp));
  }

  const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "CF-Worker-Server",
    },
  }).then((res) => res.json());

  await c.env.CACHE.put(username, JSON.stringify(resp), {
    expirationTtl: 60 * 60,
  });

  return c.json(resp);
});

export default app;
```

## Example: Inspecting KV From the CLI

Wrangler exposes sub-commands to read and write KV entries directly, which is useful for debugging cached values without making HTTP requests.

```bash
# Read a cached entry by key (username)
npx wrangler kv key get --binding=CACHE "honojs" --remote

# Write a test entry manually
npx wrangler kv key put --binding=CACHE "foo" "bar" --remote

# List all keys in the namespace
npx wrangler kv key list --binding=CACHE --remote

# Remove a stale entry before its TTL expires
npx wrangler kv key delete --binding=CACHE "foo" --remote
```

## Deploying to Cloudflare

When you are ready to go live, a single command publishes the Worker:

```bash
npm run deploy
```

Wrangler compiles the TypeScript, uploads the bundle, and prints a URL in the form `https://cloudflare-api-kv.<your-subdomain>.workers.dev`. The same KV namespace used during development is available in production because the binding id is the same.

## When To Use It

This pattern is a good fit when:

- Your upstream API has rate limits or slow response times you want to shield against.
- The same resource is requested many times within a short window.
- You want caching logic to live at the network edge rather than inside an origin server.
- You need automatic expiration without running a background cleanup process.

It is less suited for data that must be strongly consistent across all edge locations or when write-heavy workloads are expected — KV propagates writes to all locations within about 60 seconds and is designed for read-heavy patterns.

## Final Thoughts

This project is a compact but real-world example of what Workers KV enables. With fewer than 35 lines of application code, the Worker eliminates redundant GitHub API calls, reduces response latency for repeat requests, and handles cache expiration automatically. The same pattern scales directly to caching other external API calls, storing feature flags, or serving configuration data globally — all without adding a database tier to your infrastructure.
