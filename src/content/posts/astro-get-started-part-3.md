---
title: "Getting Started with Astro - Part 3: Deployment and Advanced Features"
meta_title: "Getting Started with Astro - Part 3: Deployment and Advanced Features"
description: "Learn how to deploy your Astro site, optimize performance, and leverage advanced features for production-ready websites."
date: 2023-11-03
image: "../../assets/images/astro-deployment.svg"
authors: ["dragos"]
categories: ["Web Development"]
tags: ["astro", "jamstack", "deployment", "optimization"]
series:
  name: "Astro Get Started"
  position: 3
---

## Deploying Your Astro Site

In [Part 1](/astro-get-started-part-1), we set up our first Astro project, and in [Part 2](/astro-get-started-part-2), we explored components and content management. Now, let's learn how to deploy your Astro site to the web and explore some advanced features.

Astro generates static HTML by default, making it easy to deploy to various hosting platforms. Let's explore the deployment process and some popular hosting options.

### Building Your Site for Production

Before deploying, you need to build your site for production:

```bash
npm run build
```

This command generates optimized static files in the `dist/` directory. You can preview the production build locally with:

```bash
npm run preview
```

### Deployment Options

#### Netlify

Netlify is a popular choice for deploying Astro sites:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up for Netlify and connect your repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click "Deploy site"

You can also use the Netlify CLI for deployment:

```bash
# Install the Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
ntl deploy
```

#### Vercel

Vercel is another excellent option for Astro sites:

1. Push your code to a Git repository
2. Import your project on Vercel
3. Vercel will automatically detect Astro and configure the build settings
4. Click "Deploy"

#### GitHub Pages

To deploy to GitHub Pages, you can use the GitHub Actions workflow:

1. Create a file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

2. Configure your Astro project for GitHub Pages by adding a `site` property to your `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name',
  // other configuration...
});
```

## Server-Side Rendering (SSR)

While Astro generates static HTML by default, it also supports server-side rendering for dynamic content. To enable SSR, you need to add an adapter for your hosting platform:

```bash
# For Node.js
npm install @astrojs/node

# For Deno
npm install @astrojs/deno

# For Vercel
npm install @astrojs/vercel

# For Netlify
npm install @astrojs/netlify
```

Then update your `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
});
```

With SSR enabled, you can create dynamic routes and access request information:

```astro
---
// src/pages/user/[id].astro
export function getStaticPaths() {
  return [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];
}

const { id } = Astro.params;
---

<h1>User {id}</h1>
```

## Performance Optimization

Astro is designed for performance, but there are additional optimizations you can implement:

### Image Optimization

Use the built-in image integration for automatic optimization:

```bash
npm install @astrojs/image sharp
```

Update your `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [image()],
});
```

Then use the optimized image components:

```astro
---
import { Image } from '@astrojs/image/components';
import heroImage from '../assets/hero.jpg';
---

<Image src={heroImage} width={800} height={400} format="webp" alt="Hero image" />
```

### Font Optimization

For optimal font loading, use the `fontsource` packages or implement a font loading strategy:

```bash
npm install @fontsource/inter
```

Then import the font in your layout:

```astro
---
// Import the font in your layout
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
---

<style>
  body {
    font-family: 'Inter', sans-serif;
  }
</style>
```

## Advanced Features

### Internationalization (i18n)

Implement multi-language support in your Astro site:

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

Organize your content by locale:

```
src/content/
  ├── blog/
  │   ├── en/
  │   │   └── post-1.md
  │   ├── es/
  │   │   └── post-1.md
  │   └── fr/
  │       └── post-1.md
```

### View Transitions

This theme does not use Astro's client router (formerly `<ViewTransitions />`). It ships as a classic multi-page app: every navigation is a normal page load with full HTML, and interactivity comes from small vanilla scripts attached to individual widgets, such as the theme toggle, table of contents, search, tabs, and the click-to-load video embed.

That is a deliberate trade-off: there is no client-side router state to manage, and every page starts with a clean DOM, which keeps widget scripts simple. If your own project needs smooth cross-page transitions, you can add Astro's client router to your layout — just review every widget script's initialization and teardown when you do, because handlers written for full page loads also need to run again after client-side navigations.

### Authentication

Implement authentication in your Astro site using Auth.js (formerly NextAuth):

```bash
npm install @auth/core @auth/astro
```

Create an authentication endpoint:

```typescript
// src/pages/api/auth/[...auth].ts
import { Auth } from '@auth/core';
import GitHub from '@auth/core/providers/github';
import { defineConfig } from 'astro/config';

export const authConfig = {
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_ID,
      clientSecret: import.meta.env.GITHUB_SECRET,
    }),
  ],
};

export const { GET, POST } = Auth(authConfig);
```

### Content Prerendering

Prerender specific pages at build time while using SSR for others:

```astro
---
// src/pages/static-page.astro
export const prerender = true;
---

<h1>This page is prerendered at build time</h1>
```

## Testing and Debugging

### Unit Testing

Set up testing for your Astro components:

```bash
npm install -D vitest @testing-library/dom
```

Create a test file:

```typescript
// src/components/Button.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/dom';

describe('Button', () => {
  it('renders correctly', () => {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    button.classList.add('btn');
    
    const { getByText } = render(button);
    expect(getByText('Click me')).toBeTruthy();
  });
});
```

### Debugging

Use the built-in dev tools for debugging:

- `astro dev --verbose` for detailed build logs
- Browser DevTools for client-side debugging
- VS Code debugger for server-side code

## Extending Astro

### Creating Custom Integrations

Build your own Astro integration:

```javascript
// my-integration.js
export default function myIntegration() {
  return {
    name: 'my-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        // Modify Astro config
        updateConfig({
          vite: {
            plugins: [/* your Vite plugins */],
          },
        });
      },
      'astro:build:done': ({ pages }) => {
        console.log(`Build complete! ${pages.length} pages generated.`);
      },
    },
  };
}
```

Then use it in your config:

```javascript
import { defineConfig } from 'astro/config';
import myIntegration from './my-integration.js';

export default defineConfig({
  integrations: [myIntegration()],
});
```

## Conclusion

Congratulations! You've completed our three-part series on getting started with Astro. We've covered everything from basic setup and components to deployment and advanced features.

Astro offers a powerful yet flexible approach to building modern websites. Its focus on performance, combined with the ability to use your favorite UI frameworks and tools, makes it an excellent choice for content-focused sites.

As you continue your Astro journey, remember these key takeaways:

1. **Start with static by default** - Astro's static-first approach ensures fast performance
2. **Use islands for interactivity** - Add JavaScript only where needed
3. **Leverage the ecosystem** - Take advantage of Astro's growing collection of integrations
4. **Optimize for production** - Implement performance best practices
5. **Stay updated** - Astro is actively developed, with new features added regularly

We hope this series has given you a solid foundation to build amazing websites with Astro. Happy coding!

---

Need to review earlier topics? Check out [Part 1: Introduction and Setup](/astro-get-started-part-1) or [Part 2: Components and Content](/astro-get-started-part-2).
