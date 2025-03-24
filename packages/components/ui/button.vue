<template>
  <a class="c-button btn" :href="link" target="_blank">
    {{ text }}
  </a>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    link: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.c-button {
  display: inline-flex;
  height: 36px;
  align-items: center;
  font-weight: 500;
  padding: 0 16px;
  background-color: var(--color-bg-input);
  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.04), 0 1px 4px -1px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  cursor: pointer;
}
</style>
