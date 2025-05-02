<template>
  <div :class="['card-json']">
    <label v-if="label">
      {{ label }}
    </label>
    <div :class="['card-json__wrap', { expand: lineCount > 10 }, { expanded: expanded === true }]">
      <Copy :text="text"></Copy>
      <pre v-html="html"></pre>
    </div>
    <div class="card-json__expander btn" v-if="lineCount > 10" @click="onExpand">{{ expandText }}</div>
  </div>
</template>

<script>
import { highlightText } from "@speed-highlight/core";
import * as jsonSyntax from "/../node_modules/@speed-highlight/core/dist/languages/json.js";
import Copy from "@operational.co/components/ui/copy.vue";

export default {
  components: {
    Copy
  },

  props: {
    payload: {}
  },

  data: function () {
    return {
      html: "",
      lineCount: "",
      expanded: false
    };
  },

  computed: {
    label: function () {
      return this.payload.label || null;
    },
    text: function () {
      let text = this.payload.content;

      text = text || {};

      if (typeof text === "string") {
        try {
          text = JSON.parse(text);
        } catch (err) {
          text = "";
        }
      }

      return JSON.stringify(text, null, 2);
    },
    variant: function () {
      return this.payload.variant || "";
    },
    expandText: function () {
      if (this.expanded) {
        return `Hide json`;
      }

      return "Show all json";
    }
  },

  methods: {
    onExpand: function () {
      this.expanded = !this.expanded;
    },
    render: async function () {
      let opt = {
        hideLineNumbers: true
      };

      let text = this.text;
      let mode = "multiline";

      const lineCount = text.trim().split("\n").length;

      this.lineCount = lineCount;

      let code = await highlightText(text, { sub: jsonSyntax.default }, mode == "multiline", opt);

      // Clean trailing empty line, if any
      code = code.replace(/(<br\s*\/?>\s*)$/, ""); // Remove final <br> if exists
      code = code.replace(/(<span[^>]*>\s*<\/span>\s*)$/, ""); // Remove final empty span if exists

      this.html = code;
    }
  },

  mounted: function () {
    this.render();
  }
};
</script>

<style lang="scss">
.card-json {
  &__wrap {
    --line-height: 19;
    max-width: 100%;
    overflow-x: auto;
    background-color: var(--color-bg-3);
    border-radius: var(--border-radius);
    position: relative;

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

    &.expand {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      max-height: calc(var(--line-height) * 10px + 4px);
      overflow: hidden;

      &.expanded {
        overflow-x: auto;
        max-height: initial;
      }
    }

    .c-copy {
      position: absolute;
      top: var(--margin);
      right: var(--margin);
    }
  }

  &__expander {
    width: 100%;
    font-size: var(--font-size-sm);

    &.btn {
      height: auto;
      padding: var(--margin-sm);
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  pre {
    width: 100%;
    padding: 4px;
    margin-bottom: 0;
    font-size: var(--font-size-sm);
    font-family: "Jetbrains Mono";
  }

  label {
    display: block;
    margin-top: var(--margin-sm);
    margin-bottom: var(--margin-sm);
    font-size: var(--font-size-xs);
    opacity: 0.8;
    line-height: 1.2;
  }

  @media screen and (max-width: 576px) {
    pre {
      font-size: var(--font-size-xs);
    }
  }
}
</style>
