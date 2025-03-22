<template>
  <div class="c-modal-close" @click="onClick">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 18L18 6M6 6L18 18"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  components: {},

  data: function () {
    return {};
  },

  props: {
    active: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    onClick: function () {
      this.$emit("onClick");
    },
  },
};
</script>

<style lang="scss">
.c-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px;
  background-color: var(--color-bg-4);
  border-radius: 99px;

  &:hover,
  &:active {
    background-color: var(--color-bg-4);
    cursor: pointer;
  }
}
</style>
