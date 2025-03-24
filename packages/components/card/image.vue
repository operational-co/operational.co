<template>
  <div :class="['card-image', { 'variant-muted': variant === 'muted' }]">
    <label v-if="label">
      {{ label }}
    </label>
    <img v-if="imageSrc" :src="imageSrc" />
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    payload: {}
  },

  computed: {
    label: function () {
      return this.payload.label || null;
    },
    imageSrc: function () {
      return this.payload.content || "";
    },
    variant: function () {
      return this.payload.variant || "";
    }
  },

  methods: {}
};
</script>

<style lang="scss">
.card-image {
  &.variant-muted {
    font-size: var(--font-size-xs);
    opacity: 0.8;
    line-height: 1.2;
  }

  label {
    display: block;
    font-size: var(--font-size-xs);
    opacity: 0.8;
    line-height: 1.2;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin-top: var(--margin-sm);
    border-radius: var(--border-radius);
  }
}
</style>
