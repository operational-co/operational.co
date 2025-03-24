<template>
  <div class="c-widget-header">
    <span class="c-widget-header__byline"> Monthly signups </span>
    <h3 class="c-widget-header__title">3,255</h3>
    <span class="c-widget-header__subtitle" v-if="subtitle">
      {{ subtitle }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    subtitle: {
      default: "10th Sep - 21st Sep"
    }
  }
};
</script>

<style lang="scss">
.c-widget-header {
  padding: var(--spacer-sm);
  //background-color: red;

  &__byline {
    display: block;
    font-weight: 500;
    font-size: var(--font-size-sm);
    margin-bottom: var(--margin-sm);
  }

  &__title {
    margin-bottom: var(--margin-sm);
    font-style: initial;
    font-weight: 500;
    font-size: var(--font-size-xl);
    color: #6a67ce;
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
