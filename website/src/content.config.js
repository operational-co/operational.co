// src/content.config.ts
import { z, defineCollection } from "astro:content";

// 2. Import loader(s)
import { glob, file } from "astro/loaders";

// 1. Define a "blog" collection
const docs = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

const api = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/content/api" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    generatedFromOpenapi: z.boolean().optional(),
    method: z.string().optional(),
    path: z.string().optional(),
    operationId: z.string().optional(),
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

const integrations = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/integrations" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

const usecases = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/usecases" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    date: z.preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
      return val;
    }, z.date()),
    tags: z.array(z.string()),
    icon: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: z.object({
    id: z.number(),
    status: z.string(),
    sort: z.number().nullable().optional(),
    date_created: z.string().nullable().optional(),
    date_updated: z.string().nullable().optional(),
    title: z.string(),
    subtitle: z.string().nullable().optional(),
    slug: z.string(),
    category: z.string().nullable().optional(),
    banner: z.string().nullable().optional(),
    banner_og: z.string().nullable().optional(),
    banner_id: z.string().nullable().optional(),
    banner_og_id: z.string().nullable().optional(),
  }),
});

// 2. Export your collections
export const collections = {
  docs,
  api,
  manual,
  selfhosted,
  integrations,
  pages,
  usecases,
  blog,
};
