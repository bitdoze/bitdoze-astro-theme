# Bitdoze Astro Blog Theme

A modern, responsive blog theme for Astro with support for tags, categories, and series. This theme is designed to be fast, SEO-friendly, and easy to customize.

## Features

- 🚀 **Built with Astro** - Benefit from Astro's speed and flexibility
- 📱 **Fully Responsive** - Looks great on all devices
- 🎨 **Customizable** - Easy to adapt to your brand
- 🔍 **SEO Optimized** - Meta tags, Open Graph, and JSON-LD
- 📝 **Blog Ready** - Support for posts, categories, tags, and series
- 🔎 **Search Functionality** - Client-side search with Fuse.js
- 📊 **Pagination** - For blog posts, categories, tags, and authors
- 📰 **RSS Feed** - Automatically generated RSS feed
- 🗺️ **Sitemap** - Automatically generated sitemap
- 🖋️ **MDX Support** - Use components in your markdown
- 🔤 **Typography** - Beautiful typography with Tailwind CSS
- 🌙 **Icons** - Easy icon usage with Astro Icon
- 💡 **FOUC Prevention** - Inline scripts to minimize flash of unstyled content and theme inconsistencies on load.

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   ├── config/         # Site configuration
│   ├── content/        # Content collections (blog posts, authors, etc.)
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components and routes
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── astro.config.mjs    # Astro configuration
├── package.json        # Dependencies and scripts
```

### Key Directories and Files

- **src/config/**: Contains configuration files for the site, menus, and social links
- **src/content/**: Contains all content collections (blog posts, authors, pages)
- **src/layouts/**: Contains layout components used throughout the site
- **src/pages/**: Contains all page components and defines the routing structure

## Components

The theme includes several reusable components:

- **Layout.astro**: Main layout component with header and footer
- **PostLayout.astro**: Layout for blog posts with metadata and content
- **Header/Footer**: Navigation and site information
- **Pagination**: For navigating through multiple pages of content
- **Search**: Client-side search functionality
- **Author Card**: Display author information
- **Post Card**: Display post previews in lists
- **Tag/Category Cloud**: Display and filter by tags or categories

## Getting Started

### Prerequisites

- Node.js (version 16.12.0 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone this repository:
   ```bash
   git clone git@github.com:bitdoze/bitdoze-astro-theme.git my-blog
   cd my-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:4321`

### Configuration

Tailor the theme to your needs by updating the following configuration files:

1.  **Site URL**:
    *   Set your production site URL in `astro.config.mjs`. Look for the `site` property:
        ```javascript
        // astro.config.mjs
        export default defineConfig({
          site: 'https://your-domain.com', 
          // ...
        });
        ```
2.  **Primary Site Metadata & Settings**:
    *   Update `src/config/site.ts` for essential site details such as:
        *   `title`: The main title of your site.
        *   `description`: A brief description for SEO and metadata.
        *   `author`: Default author name.
        *   `logoText`: Text displayed next to the logo (if applicable).
        *   `ogImage`: Path to your default OpenGraph image.
        *   `postsPerPage`: Number of posts to display on paginated pages.
        *   `summaryLength`: Default length for post summaries.
        *   `copyright`: Copyright notice.
3.  **Menus**:
    *   Modify `src/config/menu.json` to define navigation links for the header and footer.
4.  **Social Media Links**:
    *   Update `src/config/social.json` with your social media profile URLs.
5.  **Other Specific Configurations (`src/config/config.json`)**:
    *   The `src/config/config.json` file holds some remaining specific parameters:
        *   `site.trailing_slash`: Whether to use trailing slashes in URLs (Astro also handles this).
        *   `params.contact_form_action`: URL endpoint for the contact form (if used).
        *   `contactinfo`: Your address, email, and phone number for display.

### Creating Content

#### Blog Posts

Create a new `.md` or `.mdx` file in `src/content/posts/` with the following frontmatter:

```md
---
title: "Your Post Title"
meta_title: "SEO Title (optional)"
description: "Post description for SEO"
date: 2023-06-01
image: "../../assets/images/your-image.jpg"
authors: ["author-id"]
categories: ["category-name"]
tags: ["tag1", "tag2"]
series: ["Series Name", "Part Number"]
---

Your post content goes here...
```

#### Authors

Create a new `.md` file in `src/content/authors/` with the following frontmatter:

```md
---
title: "Author Name"
meta_title: "Author Name - Astro Blog Theme"
image: "../../assets/images/authors/author-image.jpg"
description: "Author description"
social:
  facebook: "https://facebook.com/username"
  twitter: "https://twitter.com/username"
  website: "https://hieupn.com"
---

Author bio goes here...
```

## Customization

### Styling

This theme uses **Tailwind CSS v4** for styling, which emphasizes a CSS-first, minimal-configuration approach.

**Key Styling Files:**

*   **`src/styles/global.css`**: This is the central file for Tailwind CSS setup and custom styles.
    *   Tailwind's core styles (base, components, utilities) are imported via `@import "tailwindcss";`.
    *   The `@tailwindcss/typography` plugin is included using `@plugin "@tailwindcss/typography";`.
    *   You can customize the theme by modifying the CSS variables defined in this file, which control colors, fonts, and other aspects.
    *   You can also add your own custom CSS rules here.

*   **`astro.config.mjs`**: The `@tailwindcss/vite` plugin is integrated here, but typically requires no direct configuration for v4 unless you have very specific needs.

**Advanced Customization (Optional):**

While most styling can be managed through `src/styles/global.css`, if you need to make advanced Tailwind customizations (e.g., adding complex custom themes, other specific Tailwind plugins that require JS configuration, or modifying Tailwind's default settings extensively), you can create a `tailwind.config.js` file in the project root. The `@tailwindcss/vite` plugin should automatically detect and use this file. Refer to the [official Tailwind CSS documentation](https://tailwindcss.com/docs) for details on `tailwind.config.js` options.

### Adding New Pages

Create a new `.astro` file in the `src/pages/` directory. The file path will determine the URL.

## Deployment

Build your site for production:

```bash
npm run build
```

The built site will be in the `dist/` directory, ready to be deployed to your favorite hosting platform.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Astro Icon](https://github.com/natemoo-re/astro-icon)
- Search functionality with [Fuse.js](https://fusejs.io)