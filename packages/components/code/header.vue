<template>
  <div class="c-code-header">
    <div
      @click.prevent="onClick(tab)"
      :class="['c-code-header__tab', { active: currentTab && currentTab === tab.name }]"
      v-for="(tab, i) in tabs"
      :key="i"
    >
      {{ tab.text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTab: {},
    tabs: {
      default: function () {
        return [
          {
            name: "Nodejs"
          }
        ];
      }
    }
  },

  methods: {
    onClick: function (tab) {
      this.$emit("onClick", tab);
    }
  }
};
</script>

<style lang="scss">
.c-code-header {
  border-radius: var(--border-radius);
  background-color: var(--color-bg-2);
  overflow: hidden;

  &__tab {
    display: inline-block;
    padding: var(--margin) var(--margin-lg);
    user-select: none;
    cursor: pointer;

    &.active {
      background-color: var(--color-bg-3);
    }
  }
}
</style>
