<template>
  <div class="p-articles-slug">
    <Constrain size="sm">
      <div class="p-articles-slug__inner" v-if="post">
        <div class="c-article">
          <Toc :list="toToc(post)"></Toc>

          <article class="c-page" v-html="toHtml(post)"></article>
        </div>

        <ArticleAuthor></ArticleAuthor>

        <ArticleRelated :posts="posts" :post="post" :nextPost="nextPost"></ArticleRelated>
      </div>
    </Constrain>
  </div>
</template>

<script>
import helper from "@/lib/helper.js";

import Constrain from "@operational.co/components/ui/constrain.vue";
import Toc from "@/components/article-toc.vue";
import ArticleRelated from "@/components/article-related.vue";
import ArticleAuthor from "./article-author.vue";

import { marked } from "marked";

const renderer = {
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

    return `
            <h${depth} name="${escapedText}" id="${escapedText}" >
              ${text}
            </h${depth}>`;
  },
  link({ tokens, href }) {
    let list = ["operational.co", "swipekit.app"];

    let allow = false;

    for (let i = 0; i < list.length; i++) {
      let domain = list[i];

      if (href.includes(domain)) {
        allow = true;
        break;
      }
    }
    let rel = "";

    if (!allow) {
      rel = `rel="noopener noreferrer" target="_blank"`;
    }

    const text = this.parser.parseInline(tokens);
    return `<a href="${href}" ${rel}>${text}</a>`;
  },
};

marked.use({
  renderer,
});

export default {
  components: {
    Constrain,
    Toc,
    ArticleRelated,
    ArticleAuthor,
  },

  props: {
    post: {},
    nextPost: {},
    posts: {},
  },

  methods: {
    formatDate: function (date) {
      if (!date) {
        return null;
      }
      if (typeof Intl === undefined) {
        return date;
      }

      date = new Date(date);

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      date = new Intl.DateTimeFormat("en-US", options).format(date);

      return date;
    },
    toHtml: function (post) {
      const html = marked.parse(post.content_markdown);

      return html;
    },
    toToc: function (post) {
      const lexer = new marked.Lexer({});
      const tokens = lexer.lex(post.content_markdown);

      let list = [];

      list.push({
        title: "Introduction",
        link: "#",
      });

      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (token.type === "heading" && token.depth === 2) {
          let escapedText = token.text.toLowerCase().replace(/[^\w]+/g, "-");

          list.push({
            title: token.text,
            link: `#${escapedText}`,
          });
        }
      }

      return list;
    },
  },

  fetchKey: "articles",
};
</script>

<style lang="scss">
.p-articles-slug {
  padding: var(--spacer) 0;
  padding-top: 0;
  position: relative;
  overflow-x: hidden;

  &__inner {
    margin: 0 auto;
  }

  .c-article {
    counter-reset: h2-counter;

    --new-color-font: hsl(var(--hue-p), 6%, 88%);

    p,
    ul,
    ol {
      line-height: 1.6;
      margin-bottom: 1.25rem;
      color: var(--new-color-font);
    }

    img {
      margin-top: var(--margin);
      border-radius: var(--border-radius);
    }

    > p > code,
    ul li > code,
    ol li > code {
      padding: 2px;
      border-radius: var(--border-radius-sm);
      background-color: var(--color-bg-2);
      border: var(--color-bg-4) solid 1px;
      font-weight: 500;
      white-space: nowrap;
    }

    h1 {
      font-family: var(--font-family-heading);
      font-size: var(--font-size-xxxxl);
      font-weight: 200;
    }

    .c-card {
      margin-bottom: var(--margin-lg);
      max-width: 600px;
    }

    > pre {
      background-color: transparent !important;
    }

    > code {
      display: block;
      line-height: 1.2;
      padding: var(--margin);
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-sm);
      background-color: var(--color-bg-2) !important;
    }

    &__info {
      margin-bottom: var(--spacer-sm);
      text-align: center;
      opacity: 0.75;
    }

    .block-header {
      color: var(--color-font);
      display: block;

      h1,
      h2,
      h3 {
        padding-top: var(--margin);
      }
    }

    h2 {
      text-align: center;
      position: relative;
      counter-increment: h2-counter;
      margin-top: 4rem;
      margin-bottom: 1rem;

      &:before {
        content: " Part " counter(h2-counter) "";
        display: block;
        position: absolute;
        bottom: 100%;
        text-align: center;
        width: 100%;
        font-size: var(--font-size-sm);
        font-weight: 700;
        text-transform: uppercase;
        line-height: 1.4;
      }
    }

    @media screen and (max-width: 576px) {
      > p,
      > ul {
        font-size: 1.125rem;
        font-weight: 450;
      }
    }
  }

  .block-image {
    img {
      display: block;

      max-width: 100%;

      height: auto;
      border-radius: 10px;
    }

    p {
      margin-top: var(--margin);
      font-style: italic;
      opacity: 0.7;
    }
  }

  blockquote {
    margin: var(--spacer) 0;
    font-size: var(--font-size-lg);
    opacity: 0.8;
    font-style: italic;
  }

  pre {
    font-size: var(--font-size-xs);

    background-color: var(--color-bg-3);
    padding: 12px;
    border-radius: var(--border-radius-sm);
    margin-bottom: 25px;
  }

  .back {
    display: flex;
    margin-bottom: 8px;
    color: var(--color-grey-2);

    svg {
      margin-right: 8px;
    }
  }

  @media screen and (max-width: 576px) {
    h1 {
      font-size: 44px;
    }

    &__img {
      max-width: 140px;
    }

    .c-article {
      h2 {
        text-align: center;
        position: relative;
        counter-increment: h2-counter;
        margin-top: calc(var(--font-space) * 6);
        margin-bottom: calc(var(--font-space) * 2);
      }
    }
  }
}
</style>
