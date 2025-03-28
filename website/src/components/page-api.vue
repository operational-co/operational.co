<template>
  <div class="c-page-api">
    <Constrain size="lg">
      <template #sidebar>
        <Toc :pathname="pathname" :headings="headings"></Toc>
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
    Toc
  },

  props: {
    pathname: {},
    headings: {}
  },

  computed: {}
};
</script>

<style lang="scss">
.c-page-api {
  padding: 3rem 0;
  background-color: var(--color-bg-2);
  border-top: var(--color-bg-4) solid 1px;

  @media screen and (max-width: 576px) {
    padding-top: 0;
    padding-bottom: 3rem;
  }
}
</style>
