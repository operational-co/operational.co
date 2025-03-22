<template>
  <div class="c-article-header">
    <Constrain>
      <div class="c-article-header__inner" v-if="post">
        <img
          class="c-article-header__img"
          v-if="post.banner"
          :src="`https://writings.operational.co/assets/${post.banner}?format=webp&quality=70`"
        />
        <h1>
          {{ post.title }}
        </h1>

        <div class="c-article-header__info">
          <span v-if="post.date_created"> Written on {{ formatDate(post.date_created) }} </span>
        </div>
      </div>
    </Constrain>
  </div>
</template>

<script>
import helper from "@/lib/helper.js";

import edjsParser from "editorjs-parser";

import Constrain from "@operational.co/components/ui/constrain.vue";

function slugify(str) {
  if (!str) {
    return "";
  }

  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/_/g, "") // Remove underscores
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

const customParsers = {
  nestedlist: function (data, config) {
    //console.log(config);

    let str = ``;

    let items = data.items || [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      str = `${str}<li><p>${item.content}</p></li>`;
    }

    if (str) {
      str = `<ul>${str}</ul>`;
    }

    return str;
  },
  header: function (data, config) {
    const level = data.level || 2;
    return `<a class="block-header block-header-${level}" href="#${slugify(data.text)}"><h${level} id="${slugify(
      data.text
    )}">${data.text}</h${level}></a>`;
  },
  image: function (data, config) {
    const baseUrl = `https://writings.operational.co`;
    return `<div class="block-image"><img src="${baseUrl}${data.file.url}?format=webp&quality=80" alt="${data.caption}" ><p>${data.caption}</p></p></div>`;
  }
  // a : function(data, config) {

  // }
};

const config = {
  nestedlist: {}
};

const parser = new edjsParser(config, customParsers);

export default {
  components: {
    Constrain
  },

  props: {
    post: {},
    nextPost: {}
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
        day: "numeric"
      };

      date = new Intl.DateTimeFormat("en-US", options).format(date);

      return date;
    },
    toHtml: function (content) {
      return parser.parse(content);
    },
    toToc: function (content) {
      let blocks = content.blocks || [];

      blocks = JSON.parse(JSON.stringify(blocks));

      let list = [];

      if (!blocks[0]) {
        return [];
      }

      if (blocks[0].type === "paragraph") {
        list.push({
          title: "Introduction",
          link: "#"
        });
      }

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (block.type !== "header") {
          continue;
        }

        if (block.data.level !== 2) {
          continue;
        }

        list.push({
          title: block.data.text || "",
          link: `#${slugify(block.data.text)}`
        });
      }

      return list;
    }
  },

  fetchKey: "articles"
};
</script>

<style lang="scss">
.c-article-header {
  padding: var(--spacer) 0;
  position: relative;
  overflow-x: hidden;

  &__img {
    display: block;
    position: relative;
    z-index: 1;
    max-width: 200px;
    height: auto;
    margin: 0 auto;
    margin-bottom: var(--spacer);
    border-radius: var(--border-radius-lg);
  }

  h1 {
    position: relative;
    z-index: 1;
    text-align: center;

    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-color: linear-gradient(180deg, #fff 60%, rgba(255, 255, 255, 0.8));
    background-image: linear-gradient(180deg, #fff 60%, rgba(255, 255, 255, 0.8));
  }

  &__info {
    text-align: center;
    color: var(--color-font-light);
  }

  @media screen and (max-width: 576px) {
  }
}
</style>
