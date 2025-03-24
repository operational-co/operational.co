<template>
  <span class="c-subtitle">
    {{ subtitle }}
  </span>
</template>

<script>
export default {
  props: {
    subtitle: {}
  }
};
</script>

<style lang="scss">
.c-subtitle {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-font-light);
}
</style>
