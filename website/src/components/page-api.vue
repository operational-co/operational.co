<template>
  <div class="c-page-api">
    <Constrain size="lg">
      <template #sidebar>
        <Toc :pathname="pathname"></Toc>
      </template>
      <template #default>
        <slot></slot>
      </template>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";
import Toc from "@operational.co/components/ui/toc.vue";

export default {
  components: {
    Constrain,
    Subtitle,
    Toc,
  },

  props: {
    pathname: {},
  },

  computed: {},
};
</script>

<style lang="scss">
.c-page-api {
  padding: 3rem 0;
  background-color: var(--color-bg-2);
  border-top: var(--color-bg-4) solid 1px;

  .c-constrain {
    &__inner {
      padding: 2rem 1rem;
      background-color: var(--color-bg-4);
      border-radius: 1rem;
      overflow-x: hidden;
    }
  }

  @media screen and (max-width: 980px) {
    padding-top: 0;

    .c-constrain {
      &__sidebar {
        margin-bottom: 0 !important;
        border-radius: 0 !important;
      }
      &__inner {
        border-radius: 0;
      }
    }
  }

  @media screen and (max-width: 576px) {
    padding-top: 0;
    padding-bottom: 3rem;
  }
}
</style>
