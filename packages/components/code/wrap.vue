<template>
  <div :class="['c-code-wrap', { tabs: tabs.length > 1 }, { col2: tabs.length > 0 && $slots.default }]">
    <div class="c-code-wrap__left" v-if="$slots.default">
      <slot></slot>
    </div>
    <div class="c-code-wrap__right">
      <CodeHeader v-if="tabs.length > 1" @onClick="onClick" :tabs="computedTabs" :currentTab="currentTab"></CodeHeader>
      <slot name="node" v-if="currentTab === 'node'"> </slot>
      <slot name="fetch" v-if="currentTab === 'fetch'"> </slot>
    </div>
  </div>
</template>

<script>
import Code from "./index.vue";
import CodeHeader from "./header.vue";

export default {
  components: {
    Code,
    CodeHeader
  },

  data: function () {
    return {
      tabs: [],
      currentTab: "node"
    };
  },

  computed: {
    computedTabs: function () {
      let tabs = this.tabs;

      for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];

        let name = tab.name;
        tab.text = "";

        if (name === "node") {
          tab.text = "node.js";
        } else if (name === "rest") {
          tab.text = "REST Api (javascript)";
        } else {
          tab.text = tab.name;
        }

        tabs[i] = tab;
      }

      return tabs;
    }
  },

  methods: {
    onClick: function (tab) {
      this.currentTab = tab.name;
    }
  },

  mounted: function () {
    let arr = [];

    for (let key in this.$slots) {
      if (key !== "default") {
        arr.push({
          name: key
        });
      }
    }

    if (arr.length === 0) {
      return;
    }

    arr = arr.reverse();

    this.tabs = arr;

    this.currentTab = this.tabs[0].name;
  }
};
</script>

<style lang="scss">
.c-code-wrap {
  width: 100%;
  //margin-left: -100px;
  margin-top: var(--margin-lg);
  margin-bottom: var(--margin-lg);
  // padding: var(--margin-lg);

  //border: var(--color-bg-3) solid 1px;
  //border-radius: var(--border-radius);

  &.col2 {
    display: grid;
    grid-template-columns: calc(50% - 8px) calc(50% - 8px);
    grid-column-gap: 16px;
  }

  .c-card {
    margin-bottom: 0 !important;
  }

  .c-code-header {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: var(--color-bg-4) solid 1px;
  }

  .c-code {
    margin-top: 0;
    margin-bottom: 0;

    pre {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &.tabs {
    .c-code {
      [class*="shj-lang-"] {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }

  @media screen and (max-width: 576px) {
    display: block;

    .c-card {
      margin-bottom: var(--margin-lg) !important;
    }
  }
}
</style>
