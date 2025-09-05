<template>
  <div :class="['c-chart-popup', { active: popupActive === true }]" :style="popupStyle">
    <article v-if="popupActive">
      <span>{{ computedPopupDatumX }}</span>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    popupActive: {
      type: Boolean,
      default: false,
    },
    popupStyle: {},
    computedPopupDatumX: {},
  },
};
</script>

<style lang="scss">
.c-chart-popup {
}
</style>
