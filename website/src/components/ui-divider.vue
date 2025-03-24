<template>
  <div class="c-ui-divider">
    <Constrain>
      <div class="c-ui-divider__inner"></div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";

export default {
  components: {
    Constrain
  }
};
</script>

<style lang="scss">
.c-ui-divider {
  padding: var(--spacer-lg) 0;

  &__inner {
    background-color: var(--color-bg-4);
    height: 2px;
  }
}
</style>
