import { defineCollection, z } from "astro:content";

// Post collection schema
const postsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      id: z.string().optional(),
      title: z.string(),
      meta_title: z.string().optional(),
      description: z.string().optional(),
      date: z.date().optional(),
      image: image(),
      authors: z.array(z.string()).default(["admin"]),
      categories: z.array(z.string()).default(["others"]),
      tags: z.array(z.string()).default(["others"]),
      series: z.tuple([z.string(), z.string()]).optional(),
      canonical: z.string().optional(),
      draft: z.boolean().optional(),
    }),
});

// Author collection schema
const authorsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    social: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
      })
      .optional(),
    draft: z.boolean().optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// About collection schema
const aboutCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
    what_i_do: z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional()
        })
      )
    })
  }),
});

// Export collections
export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
  authors: authorsCollection,
  about: aboutCollection,
};
