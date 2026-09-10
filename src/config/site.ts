import logo from "@assets/favicons/bitdoze_logo_better.svg";

/**
 * Central site configuration — the single place for identity, homepage copy,
 * navigation labels, page headings, and feature toggles.
 *
 * Structural data stays in sibling config files:
 * - src/config/menu.json    header and footer navigation links
 * - src/config/social.json  public social profiles
 * - src/config/config.json  contact details and the contact form endpoint
 */
export const siteConfig = {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------
  lang: "en",
  locale: "en_US",
  title: "Bit Doze Astro Blog Theme",
  brandName: "Bit Doze",
  logo,
  logoWidth: 160,
  logoHeight: 40,
  logoText: "Bit Doze Astro Blog Theme",
  author: "Dragos Balota",
  description: "A modern, responsive blog theme for Astro with support for tags, categories, and series.",
  /** Paragraph under the hero headline and in the empty-blog hero. */
  heroDescription: "Join the community to learn more about VPS hosting, blogging, and modern content management.",
  footerDescription: "Practical resources and tutorials for web developers and technology enthusiasts.",
  ogImage: "/images/og-image.png",
  postsPerPage: 11,

  // ---------------------------------------------------------------------------
  // Hero section
  // ---------------------------------------------------------------------------
  hero: {
    /** Headline is split so the accent phrase can be highlighted in the brand color. */
    title: "Modern web guides that",
    titleAccent: "actually ship",
    /** Primary call to action; href is root-relative and base-aware at render time. */
    primaryCta: { label: "Browse articles", href: "/blog/" },
    /** Secondary in-page jump; only rendered when a Learning Paths section exists. */
    secondaryCta: { label: "Find your path", href: "#learning-paths" },
    /** Labels for the proof counts; `author` is used when the count is 1. */
    statsLabels: {
      guides: "practical guides",
      topics: "topics to explore",
      author: "author writing",
      authors: "authors writing",
    },
  },

  // ---------------------------------------------------------------------------
  // Homepage sections
  // ---------------------------------------------------------------------------
  homepage: {
    showFeaturedPosts: true,
    showTaxonomyCards: true,
    showPopularTopics: true,

    /** Editor's picks from posts flagged `featured: true`. */
    featured: {
      limit: 3,
      title: "Featured Posts",
      description: "Hand-picked guides worth starting with.",
    },

    /** Newest posts that are not in the hero, featured grid, or a series. */
    latest: {
      limit: 6,
      title: "Latest Articles",
      actionLabel: "View all posts",
    },

    /** Series in position order plus the largest categories. */
    learningPaths: {
      title: "Learning paths",
      description: "Follow a series end to end, or go deep on one topic.",
      actionLabel: "Browse series",
    },

    /** Tag-driven topic columns; labels are matched case-insensitively. */
    popularTopics: {
      title: "Popular Topics",
      description: "Browse posts by topic",
      tags: ["Astro", "VPS", "Blogging"],
      postsPerTag: 4,
    },

    /** Compact taxonomy row. `icon` accepts any Astro Icon / Iconify name. */
    explore: {
      title: "Explore Content",
      description: "Browse our content by category, author, or tag",
      cards: [
        {
          href: "/categories/",
          title: "Categories",
          description: "Browse posts by topic",
          icon: "mdi:folder-multiple-outline",
        },
        {
          href: "/authors/",
          title: "Authors",
          description: "Meet our content creators",
          icon: "mdi:account-group-outline",
        },
        {
          href: "/tags/",
          title: "Tags",
          description: "Find content by specific topics",
          icon: "mdi:tag-outline",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Footer
  // ---------------------------------------------------------------------------
  footer: {
    exploreTitle: "Explore",
    latestTitle: "Latest Posts",
  },

  // ---------------------------------------------------------------------------
  // Listing and utility pages
  // `title` is the visible heading (and the SEO title prefix), `description` is
  // the meta description, and `subline` is the visible line under the heading.
  // ---------------------------------------------------------------------------
  pages: {
    blog: {
      title: "Blog",
      description: "Explore our latest articles, tutorials, and insights",
      subline: "Explore our latest articles, tutorials, and insights",
    },
    categories: {
      title: "Categories",
      description: "Browse all categories of posts on our blog",
      subline: "Browse posts by category",
    },
    tags: {
      title: "Tags",
      description: "Browse all tags and topics on our blog",
      subline: "Browse posts by tag",
    },
    authors: {
      title: "Authors",
      description: "Meet our authors and browse their posts",
      subline: "Meet our content creators and browse their posts",
    },
    series: {
      title: "Article Series",
      description: "Browse our collection of article series on various topics",
      subline: "Browse our collection of multi-part article series on various topics",
    },
    contact: {
      title: "Contact Us",
      description: "Get in touch with us",
      subline: "Get in touch with us",
    },
    search: {
      title: "Search",
      description: "Search articles and tutorials",
      placeholder: "Search for articles...",
      label: "Search articles",
      noResults: "No results found. Try a different search term.",
    },
    notFound: {
      title: "404 - Page Not Found",
      description: "The page you're looking for doesn't exist.",
      heading: "404",
      subheading: "Page Not Found",
      message: "The page you're looking for doesn't exist or has been moved.",
      homeLabel: "Go Home",
      blogLabel: "Browse Blog",
    },
  },

  // ---------------------------------------------------------------------------
  // Assets and indexing policy
  // ---------------------------------------------------------------------------
  favicons: {
    svg: "/favicon.svg",
    ico: "/favicon.ico",
  },
  noindex: {
    tags: true,
    categories: false,
    authors: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;
