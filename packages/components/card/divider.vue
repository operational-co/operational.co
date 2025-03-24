<template>
  <div :class="['card-divider']">
    <span v-if="content">
      {{ content }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    payload: {},
  },

  computed: {
    content: function () {
      return this.payload.content || null;
    },
  },
};
</script>

<style lang="scss">
.card-divider {
  padding: 4px 0;

  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--color-bg-4);
  }

  > span {
    display: inline-block;
    font-size: var(--font-size-xs);
    padding-right: 4px;
    position: relative;
    z-index: 1;
    background-color: var(--color-bg-3);
    opacity: 0.75;
  }
}
</style>
