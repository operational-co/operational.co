<template>
  <div class="c-widget-header">
    <span class="c-widget-header__byline"> {{ title }} </span>
    <h3 class="c-widget-header__title">{{ formatNumberWithCommas(metric) }}</h3>
    <!-- <span class="c-widget-header__subtitle" v-if="subtitle">
      {{ subtitle }}
    </span> -->
    <div class="c-widget-header__menu"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
    metric: {},
    subtitle: {
      default: "10th Sep - 21st Sep",
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
.c-widget-header {
  position: relative;
  padding: var(--spacer-sm);
  //background-color: red;

  &__byline {
    display: block;
    font-weight: 500;
    font-size: var(--font-size-sm);
    margin-bottom: var(--margin-sm);
  }

  &__title {
    margin-top: 0.25rem;
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
  }

  &__subtitle {
    display: block;
    font-size: var(--font-size-xs);
    opacity: 0.8;
  }

  @media screen and (max-width: 576px) {
    padding: var(--margin-lg);
    padding-bottom: 0;

    &__byline {
      font-weight: 600;
      opacity: 0.9;
    }

    &__title {
      font-weight: 550;
    }
  }
}
</style>
