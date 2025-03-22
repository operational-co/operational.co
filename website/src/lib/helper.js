import axios from "axios";
import { createDirectus, staticToken, rest, readItems } from "@directus/sdk";

const token = import.meta.env.PUBLIC_DIRECTUS_KEY;
const baseUrl = import.meta.env.PUBLIC_DIRECTUS_URL;
const client = createDirectus(baseUrl).with(staticToken(token)).with(rest());

const helper = {
  common: async (showAll = false) => {
    let articles = await client.request(readItems("article"));

    articles = articles || [];

    if (!showAll) {
      articles = articles.filter((article) => {
        if (article.status === "published") {
          return true;
        }
      });
    }

    return articles;
  },
  article: async () => {}
};

export default helper;
