<template>
  <div class="c-widget-stat">
    <span class="c-widget-stat__icon"> {{ schema.icon }} </span>
    <article>
      <h2>{{ formatNumberWithCommas(widget.data) }}</h2>
      <strong>{{ schema.title }}</strong>
      <span> Over the last {{ schema.date }} </span>
    </article>
  </div>
</template>

<script>
export default {
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
    formatNumberWithCommas(value) {
      // Ensure it's a number first
      const number = typeof value === "number" ? value : parseInt(value, 10);

      // If it's not a valid number, return the original value
      if (isNaN(number)) return value;

      // Format with commas
      return number.toLocaleString("en-US");
    },
  },
};
</script>

<style lang="scss">
.c-widget-stat {
  height: 100%;
  padding: 1rem;
  //background-color: hsl(var(--hue-red), 12%, 11%);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;

  h2 {
    margin-top: 0.5rem;
    font-size: var(--font-size-lg);
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

  > article {
    margin-top: auto;
    display: block;

    > strong {
      display: block;
      line-height: 1.4;
      font-weight: 500;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    > span {
      font-size: var(--font-size-xs);
      opacity: 0.8;

      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
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

  @media screen and (max-width: 576px) {
    padding: 0.75rem;

    > span {
      font-size: var(--font-size-xxs);
    }
  }
}
</style>
