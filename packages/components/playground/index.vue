<template>
  <div :class="['c-playground', { app: type === 'app' }]">
    <Footer
      ref="footer"
      :type="type"
      :currentCode="currentCode"
      :currentView="currentView"
      :example="currentExample"
      @onTokenUpdate="updateToken"
      @update:currentView="updateCurrentView"
      @update:selectedOption="updateCurrentOption"
      @update:notifyOption="updateNotify"
      @update:testOption="updateTest"
    ></Footer>
    <div class="c-playground__sidebar">
      <header>
        <InputText v-model:value="query" placeholder="Search for a event"></InputText>
        <article>
          <span
            @click="selectCategory(category)"
            :class="[{ active: currentCategory === category }]"
            v-for="(category, i) in categories"
            :key="i"
          >
            {{ category }}
          </span>
        </article>
      </header>
      <main>
        <SidebarItem
          :active="currentExample.title === example.title"
          @onClick="onClick"
          v-for="(example, i) in computedExamples"
          :key="i"
          :example="example"
        ></SidebarItem>
      </main>
    </div>
    <div class="c-playground__main">
      <!-- <Blurb v-if="currentExample && currentExample.description" :example="currentExample"></Blurb> -->
      <template v-if="currentView === 'view'">
        <Item :item="computedItem"></Item>
      </template>
      <template v-else>
        <Code :copy="false" :text="currentCode"></Code>
      </template>
      <Callout
        :context="context"
        :example="currentExample"
        :currentCode="currentCode"
        :currentView="currentView"
        @update:currentView="updateCurrentView"
      ></Callout>
    </div>
  </div>
</template>

<script>
import SidebarItem from "./item.vue";
import examples from "./examples.js";
import Footer from "./footer.vue";
import Callout from "./callout.vue";

import generateNodejssdk from "./generate-nodejssdk.js";
import generateAxios from "./generate-axios.js";
import generateFetch from "./generate-fetch.js";
import generateCurl from "./generate-curl.js";
import generatePhp from "./generate-php.js";
import generatePhpSdk from "./generate-php-sdk.js";
import generatePython from "./generate-python.js";

import Code from "@operational.co/components/code/index.vue";
import Item from "@operational.co/components/card/index.vue";
import InputText from "@operational.co/components/form/input-text.vue";
import { toRaw } from "vue";
import Fuse from "fuse.js";

export default {
  components: {
    Callout,
    Footer,
    Code,
    Item,
    SidebarItem,
    InputText
  },

  data: function () {
    return {
      examples: examples,
      currentCategory: null,
      currentExample: null,
      currentView: "view",
      currentOption: "nodejssdk",
      query: "",
      fuse: null,

      categories: ["saas", "stripe", "ecom", "generic"],

      context: {
        token: "",
        test: false,
        notify: false,
        baseUrl: "https://api.operational.co"
      }
    };
  },

  watch: {
    query: function () {}
  },

  props: {
    type: {
      default: ""
    },
    apikey: {}
  },

  computed: {
    currentCode: function () {
      if (!this.currentExample) {
        return "";
      }

      let str = "";
      let example = this.currentExample;
      let option = this.currentOption;

      example = toRaw(example);

      if (option === "nodejssdk") {
        str = generateNodejssdk(example, this.context);
      }
      if (option === "axios") {
        str = generateAxios(example, this.context);
      }
      if (option === "fetch") {
        str = generateFetch(example, this.context);
      }
      if (option === "curl") {
        str = generateCurl(example, this.context);
      }
      if (option === "php") {
        str = generatePhp(example, this.context);
      }
      if (option === "php-sdk") {
        str = generatePhpSdk(example, this.context);
      }
      if (option === "python") {
        str = generatePython(example, this.context);
      }

      return str;
    },
    computedExamples: function () {
      let examples = this.examples;

      examples = toRaw(examples);

      if (this.currentCategory) {
        examples = examples.filter((example) => {
          if (!example.category) {
            return false;
          }

          if (example.category.includes(this.currentCategory)) {
            return true;
          }

          return false;
        });
      }

      if (!this.query) {
        return examples;
      }

      let results = this.fuse.search(this.query);

      results = results.map((res) => {
        return res.item;
      });

      return results;
    },
    computedItem: function () {
      let currentItem = null;
      if (this.currentExample && this.currentExample.item) {
        currentItem = this.currentExample.item;
      }
      const date = new Date().toISOString();
      const item = {
        id: 1,
        avatar: "-",
        name: "NA",
        createdAt: date,

        ...currentItem
      };

      return item;
    }
  },

  methods: {
    selectCategory: function (category) {
      if (this.currentCategory === category) {
        this.currentCategory = null;
      } else {
        this.currentCategory = category;
      }
    },
    updateToken: function (token) {
      this.context.token = token;
    },
    onClick: function (example) {
      this.currentExample = example;
    },
    updateCurrentOption(newOption) {
      this.currentOption = newOption;
    },
    updateNotify(notify) {
      this.context.notify = notify;
    },
    updateTest(test) {
      this.context.test = test;
    },
    updateCurrentView: function (view) {
      this.currentView = view;
    }
  },

  created: function () {
    this.currentExample = examples[0];

    if (this.apikey) {
      this.context.token = this.apikey;
    }

    this.fuse = new Fuse(this.examples, {
      keys: ["title", "description"],
      threshold: 0.3,
      includeScore: false
    });
  },

  mounted: function () {
    this.$refs.footer.setToken(this.context.token);

    if (this.$store && this.$store.app && this.$store.app.baseApiUrl) {
      this.context.baseUrl = this.$store.app.baseApiUrl;
    }
  }
};
</script>

<style lang="scss">
.c-playground {
  --height: 540px;
  --sidebar-width: 240px;

  position: relative;
  margin-bottom: 4rem;
  display: grid;
  grid-template-columns: var(--sidebar-width) var(--sidebar-width) 1fr;
  height: var(--height);
  //background-color: var(--color-bg-2);
  //border-radius: calc(var(--margin) + var(--border-radius));

  overflow: hidden;

  &__sidebar {
    position: relative;
    height: 100%;
    background-color: var(--color-bg-2);
    backdrop-filter: blur(8px);
    //border-radius: calc(var(--margin) + var(--border-radius));
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    > header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 74px;
      padding: 0.5rem;
      padding-bottom: 0;

      .form-control {
        margin-bottom: 0;
      }

      article {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        padding: var(--margin-sm) 0;

        &::-webkit-scrollbar {
          height: 4px;
        }

        &::-webkit-scrollbar-thumb {
          background: hsl(var(--hue-p), 6%, 18%);
          border-radius: 0;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--hue-p), 6%, 18%);
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }
      }

      .form-control {
        background-color: var(--color-bg-1);
      }

      span {
        display: inline-block;
        padding: 4px 6px;
        font-size: var(--font-size-xs);
        font-weight: 500;
        line-height: 1;
        border-radius: var(--border-radius-sm);
        background-color: var(--color-bg-4);

        user-select: none;
        cursor: pointer;

        &:not(:last-child) {
          margin-right: var(--margin-sm);
        }

        &:hover,
        &:active,
        &.active {
          background-color: var(--color-primary);
        }
      }
    }

    > main {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 74px);
      padding: 0.5rem;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: hsl(var(--hue-p), 6%, 18%);
        border-radius: 0;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--hue-p), 6%, 18%);
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
  }

  &__main {
    height: var(--height);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;

    background-color: hsla(359, 100%, 50%, 1);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1746 1746' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
      radial-gradient(circle at 0% 99%, hsla(11, 100%, 50%, 1) 0%, transparent 67%),
      radial-gradient(circle at 46% 94%, hsla(177, 100%, 50%, 1) 0%, transparent 81%),
      radial-gradient(circle at 89% 8%, hsla(304, 100%, 9%, 1) 0%, transparent 150%),
      radial-gradient(circle at 89% 8%, hsla(206, 100%, 9%, 1) 0%, transparent 150%),
      radial-gradient(circle at 93% 95%, hsla(236, 100%, 23%, 1) 0%, transparent 66%),
      radial-gradient(circle at 89% 8%, hsla(0, 100%, 99%, 1) 0%, transparent 150%),
      radial-gradient(circle at 89% 8%, hsla(55, 94%, 54%, 1) 0%, transparent 150%);
    background-blend-mode: overlay, normal, normal, normal, normal, normal, normal, normal;

    box-shadow:
      inset 16px 0 128px 16px rgba(20, 20, 21, 0.1),
      inset 0 0 1025px 4px rgba(16, 17, 17, 0.05);

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: hsl(var(--hue-p), 6%, 22%);
      border-radius: 0;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--hue-p), 6%, 22%);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    .c-code {
      max-width: 500px;
      margin-bottom: 0;
      background-color: var(--color-bg-3);
    }
    .c-card {
      width: 400px;
      margin-bottom: 0;
    }
  }

  &.app {
    border-radius: 0;
    height: calc(100vh - 68px);
    margin-bottom: 0;

    .c-playground__main {
      height: 100%;
    }
  }

  @media screen and (max-width: 576px) {
    display: block;
    height: auto;
    border-radius: 0;

    &__sidebar {
      height: 204px;
      border-radius: var(--border-radius);
    }

    &__main {
      margin-top: 1rem;
      display: block;
      padding: 3rem 2rem;
      padding-bottom: calc(146px + 3rem);
      height: auto;
      border-radius: var(--border-radius);

      .c-card {
        width: 100%;
        margin-bottom: 0;
      }

      .c-code {
        width: 100%;
        height: auto;
      }
    }

    .c-playground-blurb {
      display: none;
    }
  }
}
</style>
