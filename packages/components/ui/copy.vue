<template>
  <span class="c-copy btn" @click="onCopy">{{ copyText }}</span>
</template>

<script>
export default {
  props: {
    text: {}
  },

  data: function () {
    return {
      copying: false
    };
  },

  computed: {
    copyText: function () {
      if (this.copying) {
        return `Copied!`;
      }
      return `Copy`;
    }
  },

  methods: {
    onCopy: async function () {
      if (this.copying) {
        return;
      }
      this.copying = true;

      const text = this.text;

      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {}

      setTimeout(() => {
        this.copying = false;
      }, 800);
    }
  }
};
</script>

<style lang="scss">
.c-copy {
  &.btn {
    height: initial;
    padding: var(--margin-sm) var(--margin);
    font-size: var(--font-size-sm);
    line-height: 1.2;
  }
}
</style>
