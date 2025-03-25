<template>
  <div class="c-code" ref="code">
    <code v-if="text">
      <pre>{{ text }}</pre>
    </code>
    <code v-else>
      <slot></slot>
    </code>
    <Copy v-if="copy" :text="copyText"></Copy>
  </div>
</template>

<script>
import { highlightText } from "@speed-highlight/core";
import * as jsSyntax from "/../node_modules/@speed-highlight/core/dist/languages/js.js";
import * as bashSyntax from "/../node_modules/@speed-highlight/core/dist/languages/bash.js";
import Copy from "@operational.co/components/ui/copy.vue";

export default {
  components: {
    Copy
  },

  data: function () {
    return {
      copyText: "",
      copying: false
    };
  },

  props: {
    copy: {
      type: Boolean,
      default: true
    },
    text: {},
    lang: {}
  },

  watch: {
    text: function () {
      this.$nextTick(() => {
        this.render();
      });
    }
  },

  computed: {
    buttonText: function () {
      if (this.copying) {
        return "Copied!";
      }
      return "Copy code";
    }
  },

  methods: {
    async render() {
      let el = this.$refs.code.querySelector("pre");

      if (!el) {
        return;
      }

      let lang = this.lang || "js";
      let sub = jsSyntax.default;

      if (lang === "bash") {
        sub = bashSyntax.default;
      }

      let txt = el.textContent;

      this.copyText = txt;

      let opt = {
        hideLineNumbers: true
      };

      let mode = `${el.tagName == "CODE" ? "in" : txt.split("\n").length < 2 ? "one" : "multi"}line`;
      el.dataset.lang = lang;
      el.className = `${[...el.classList]
        .filter((className) => !className.startsWith("shj-"))
        .join(" ")} shj-lang-${lang} shj-${mode}`;

      el.innerHTML = await highlightText(txt, { sub: sub }, mode == "multiline", opt);
    }
  },

  mounted: function () {
    this.render();
  }
};
</script>

<style lang="scss">
.c-code {
  position: relative;
  margin: 0;
  margin-bottom: 1rem;
  font-size: var(--font-size-sm);
  background-color: var(--color-bg-2);
  padding: var(--margin-lg);
  border-radius: var(--border-radius);

  > button {
    position: absolute;
    top: var(--margin);
    right: var(--margin);

    opacity: 0;

    &.btn.btn-sm {
      padding: var(--margin);
    }

    &.active {
      color: var(--color-primary);
    }
  }

  [class*="shj-lang-"] {
    margin: 0;
    padding: 0;
    font-size: var(--font-size-sm);
    line-height: 1.5;
  }

  &:hover {
    > button {
      opacity: 1;
    }
  }

  .c-copy {
    position: absolute;
    top: 8px;
    right: var(--margin);
  }
}
</style>
