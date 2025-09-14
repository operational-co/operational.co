<template>
  <div class="c-picker-header">
    <strong>Preview (with dummy data)</strong>
    <Preview :schema="schema" :type="type"></Preview>
  </div>
</template>

<script>
import Preview from "./preview.vue";
export default {
  components: {
    Preview,
  },

  props: {
    schema: {},
    type: {},
  },
};
</script>

<style lang="scss">
.c-picker-header {
  align-items: center;
  margin-bottom: 1rem;

  header {
    padding-right: 1rem;

    h3 {
      margin-bottom: 0.5rem;
    }
    p {
      font-size: var(--font-size-sm);
      line-height: 1.5;
      opacity: 0.9;
    }
  }
}
</style>
