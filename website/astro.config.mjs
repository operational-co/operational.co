import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";

const mdxOptions = {
  //remarkPlugins: [remarkToc],
  rehypePlugins: [rehypeSlug],
};

// https://astro.build/config
export default defineConfig({
  prefetch: {
    defaultStrategy: "viewport",
  },
  devToolbar: {
    enabled: false,
  },
  site: "https://operational.co",
  server: {
    port: 3000,
  },
  trailingSlash: "never",
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          //additionalData: `@import "@operational.co/styles/_globals.scss";`,
          quietDeps: true,
        },
      },
    },
  },
  integrations: [
    vue(),
    mdx(mdxOptions),
    sitemap({
      filter: (page) => {
        let excludes = [
          "https://operational.co/pitch",
          `https://operational.co/articles`,
          `https://operational.co/manual`,
          `https://operational.co/vs-logsnag`,
          `https://operational.co/vs-slack-telegram-discord`,
          `https://operational.co/styleguide`,
          `https://operational.co/manual`,
        ];
        if (excludes.includes(page)) {
          console.log(`[EXCLUDED] ${page}`);
          return false;
        }
        console.log(`[INCLUDED] ${page}`);
        return true;
      },
    }),
  ],
});
