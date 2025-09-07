<template>
  <div class="c-widget-action">
    <h2>{{ schema.title }}</h2>
    <span>{{ schema.description }}</span>
    <button @click.prevent="runAction" class="btn btn-sm btn-primary">
      <span v-if="processing" class="c-spinner sm"></span>
      <span>{{ schema.buttonText || "Run" }}</span>
    </button>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      processing: false,
    };
  },

  props: {
    data: {},
    widget: {},
  },

  computed: {
    schema: function () {
      return this.widget.schema;
    },
  },

  methods: {
    async runAction() {
      if (this.processing) {
        return;
      }

      this.processing = true;
    },
  },
};
</script>

<style lang="scss">
.c-widget-action {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  //background-color: hsl(var(--hue-red), 12%, 11%);
  border-radius: 1rem;

  h2 {
    margin-top: 0rem;
    font-size: var(--font-size-md);
    margin-bottom: 0.25rem;
    font-feature-settings:
      "case" 0,
      "dlig" 0,
      "frac" 0,
      "dnom" 0,
      "numr" 0,
      "subs" 0,
      "sups" 0,
      "tnum",
      "zero" 0,
      "ss01",
      "ss02" 0,
      "ss03" 0,
      "ss04",
      "ss05" 0,
      "ss06" 0,
      "ss07" 0,
      "ss08" 0,
      "cv01" 0,
      "cv02" 0,
      "cv03" 0,
      "cv04" 0,
      "cv05" 0,
      "cv06" 0,
      "cv07" 0,
      "cv08" 0,
      "cv09" 0,
      "cv10" 0,
      "cv11" 0,
      "cv12" 0,
      "cv13" 0,
      "cpsp" 0,
      "c2sc" 0,
      "salt" 0,
      "aalt" 0,
      "calt",
      "ccmp",
      "locl",
      "kern";

    span {
      font-size: var(--font-size);
    }
  }

  > strong {
    display: block;
    font-weight: 500;
  }

  > span {
    display: block;
    line-height: 1.4;
    font-size: var(--font-size-xs);
    opacity: 0.8;
  }

  &__icon,
  svg,
  img {
    display: block;
    width: 32px;
    height: 32px;
    color: var(--color-danger);
    opacity: 1 !important;

    font-size: var(--font-size-xl) !important;
  }

  .btn {
    margin-top: auto;
    border-radius: 32px;
  }

  @media screen and (max-width: 576px) {
    padding: 0.75rem;

    > span {
      font-size: var(--font-size-xxs);
    }
  }
}
</style>
