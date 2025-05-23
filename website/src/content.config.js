// src/content.config.ts
import { z, defineCollection } from "astro:content";

// 2. Import loader(s)
import { glob, file } from "astro/loaders";

// 1. Define a "blog" collection
const api = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/api" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

const manual = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/manual" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

const selfhosted = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/selfhosted" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

const other = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/other" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

// 2. Export your collections
export const collections = { api, manual, selfhosted, other };
