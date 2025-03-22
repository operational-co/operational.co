<template>
  <div :class="['c-constrain', size, { sidebar: !!$slots.sidebar }]">
    <div class="c-constrain__sidebar" v-if="$slots.sidebar">
      <slot name="sidebar"></slot>
    </div>
    <div class="c-constrain__inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss">
.c-constrain {
  max-width: 740px;
  margin-left: auto;
  margin-right: auto;

  &__inner {
    height: 100%;
    padding-left: var(--margin-lg);
    padding-right: var(--margin-lg);
  }

  &.xs {
    max-width: 380px;
  }

  &.sm {
    max-width: 600px;
  }

  &.lg {
    max-width: 1040px;
  }

  &.xl {
    max-width: 1400px;
  }

  &.sidebar {
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-column-gap: var(--spacer-sm);
    //max-width: 1300px;
  }

  &__sidebar {
    padding: var(--margin-lg);
    background-color: var(--color-bg-2);
    border-radius: var(--border-radius);
    align-self: start;

    > div {
      display: unset;
    }
  }

  @media screen and (max-width: 1380px) {
    &.sidebar {
      grid-template-columns: 220px 1fr;
      max-width: 940px;
    }
  }

  @media screen and (max-width: 980px) {
    &.sidebar {
      display: block;
      border-radius: 0;

      .c-constrain__sidebar {
        margin-bottom: 2rem;
      }
    }
  }
}
</style>
