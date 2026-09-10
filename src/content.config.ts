import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const postsCollection = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: z.string().optional(),
      title: z.string(),
      meta_title: z.string().optional(),
      description: z.string().min(1),
      date: z.coerce.date(),
      image: z.optional(image()),
      imageAlt: z.string().optional(),
      imageFit: z.enum(["cover", "contain"]).default("contain"),
      video: z.url().optional(),
      authors: z.array(z.string()).min(1),
      categories: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      series: z.object({
        name: z.string().min(1),
        position: z.coerce.number().int().positive(),
      }).optional(),
      slug: z.string().min(1).optional(),
      canonical: z.url().optional(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
});

const authorsCollection = defineCollection({
  loader: glob({ base: "./src/content/authors", pattern: "[^_]*.{md,mdx}" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    meta_title: z.string().optional(),
    image: z
      .string()
      .optional()
      .refine((value) => value === undefined || value.startsWith("/"), {
        message:
          "Author image must be a public asset path starting with '/' (e.g. /images/authors/dragos.webp), not a relative source path.",
      }),
    description: z.string().optional(),
    social: z
      .object({
        facebook: z.url().optional(),
        twitter: z.url().optional(),
        instagram: z.url().optional(),
        website: z.url().optional(),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "[^_]*.{md,mdx}" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ base: "./src/content/about", pattern: "[^_]*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    what_i_do: z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
        }),
      ),
    }),
  }),
});

export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
  authors: authorsCollection,
  about: aboutCollection,
};
