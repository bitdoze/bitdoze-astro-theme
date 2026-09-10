import logo from "@assets/favicons/bitdoze_logo_better.svg";

export const siteConfig = {
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
  heroDescription: "Join the community to learn more about VPS hosting, blogging, and modern content management.",
  footerDescription: "Practical resources and tutorials for web developers and technology enthusiasts.",
  ogImage: "/images/og-image.png",
  postsPerPage: 11,
  favicons: {
    svg: "/favicon.svg",
    ico: "/favicon.ico",
  },
  homepage: {
    showFeaturedPosts: true,
    showTaxonomyCards: true,
    showPopularTopics: true,
  },
  noindex: {
    tags: true,
    categories: false,
    authors: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;
