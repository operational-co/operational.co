// src/lib/helper.js
import fs from "fs/promises";
import path from "path";
import { createDirectus, staticToken, rest, readItems } from "@directus/sdk";

const token = import.meta.env.PUBLIC_DIRECTUS_KEY;
const baseUrl = import.meta.env.PUBLIC_DIRECTUS_URL;
const client = createDirectus(baseUrl).with(staticToken(token)).with(rest());

// Cache settings
const CACHE_FILE = path.resolve("./.directus-cache.json");
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in ms

const helper = {
  /**
   * Fetch all articles (cached by default).
   * @param {boolean} showAll  If true, ignores cache and returns every status.
   */
  common: async (showAll = false) => {
    // 1) If not forcing fresh, try to read from cache
    if (!showAll) {
      try {
        const { mtimeMs } = await fs.stat(CACHE_FILE);
        if (Date.now() - mtimeMs < CACHE_TTL) {
          const raw = await fs.readFile(CACHE_FILE, "utf-8");
          const cached = JSON.parse(raw);
          // Only return published in the normal case
          return cached.filter((a) => a.status === "published");
        }
      } catch {
        // cache missing or stale → fall through to fetch
      }
    }

    // 2) Fetch from Directus
    let articles = await client.request(readItems("article"));
    articles = articles || [];

    // 3) Write fresh cache
    try {
      await fs.writeFile(CACHE_FILE, JSON.stringify(articles, null, 2), "utf-8");
    } catch {
      /* silent fail if we can’t write cache */
    }

    // 4) Filter out non-published unless asked
    if (!showAll) {
      articles = articles.filter((a) => a.status === "published");
    }
    return articles;
  },

  /**
   * Fetch a single article by slug (only published by default).
   * @param {string} slug
   */
  article: async (slug) => {
    const all = await helper.common(false);
    return all.find((a) => a.slug === slug) || null;
  },
};

export default helper;
