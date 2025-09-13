<template>
  <div class="c-picker-page-select">
    <h4>Select a widget type</h4>
    <a v-for="widget in widgetTypes" :key="widget.type" @click="onSelectWidget(widget.type)">
      <span v-html="widget.svg"> </span>

      <article>
        <strong> {{ widget.title }} </strong>
        <p>{{ widget.subtitle }}</p>
      </article>
    </a>
  </div>
</template>

<script>
import widgets from "./widgets.js";

export default {
  computed: {
    widgetTypes: function () {
      return widgets;
    },
  },

  methods: {
    onSelectWidget: function (type) {
      this.$emit("onSelect", type);
    },
  },
};
</script>

<style lang="scss">
.c-picker-page-select {
  a {
    display: flex;
    align-items: flex-start;

    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: var(--color-bg-2);
    border-radius: 0.5rem;
    color: var(--color-font) !important;
    cursor: pointer;

    > span {
      display: inline-block;
      width: 48px;
      min-width: 48px;
      height: 48px;
      padding: 0.25rem;
      background: linear-gradient(
        0deg,
        hsl(var(--hue-p), 80%, 45%) 0%,
        hsl(var(--hue-p), 60%, 55%) 30%
      );
      border-radius: 0.4rem;
      margin-right: 0.5rem;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    p {
      font-size: var(--font-size-sm);
      line-height: 1.4;
      opacity: 0.8;
      margin-block-end: 0;
    }

    &:hover,
    &:active {
      background-color: var(--color-bg-3);
    }
  }
}
</style>
