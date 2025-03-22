import { createDirectus, staticToken, rest, readItems } from "@directus/sdk";

const token = `haxxor`;

const client = createDirectus("https://writings.operational.co").with(staticToken(token)).with(rest());

const helper = {
  common: async () => {
    let articles = await client.request(readItems("article"));

    articles = articles || [];

    articles = articles.filter((article) => {
      if (article.status === "published") {
        return true;
      }
    });

    return articles;
  },
  article: async () => {},
};

export default helper;
