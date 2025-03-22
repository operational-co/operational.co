<template>
  <div class="c-chart-axis">
    <span v-for="(item, i) in data" :key="i" :title="showTitle(i, item)" :class="[{ primary: showTitle(i, item) }]">
    </span>
    <span></span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: function () {
        return [];
      },
    },
  },

  computed: {
    maxY: function () {
      let maxYValue = this.data.reduce((max, obj) => (obj.y > max ? obj.y : max), -Infinity);

      return maxYValue;
    },
  },

  methods: {
    showTitle: function (i, item) {
      let mod = i % 2;

      if (mod === 0) {
        return item.x;
      }

      return "";
    },
  },
};
</script>

<style lang="scss">
.c-chart-axis {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  border-top: var(--chart-color) solid 4px;

  > span {
    position: relative;
    display: block;
    height: 6px;
    width: 8px;
    border-right: var(--chart-color) solid 2px;

    &.primary {
      height: 12px;
    }

    &:after {
      content: attr(title);
      display: block;
      position: absolute;
      top: 14px;
      left: 50%;
      font-size: var(--font-size-xxs);
      font-weight: 600;
      font-family: var(--font-family-monospace);
      opacity: 0.85;
      transform-origin: 0% 50%;
      transform: rotate(45deg);
      white-space: nowrap;
    }

    &:last-child {
      width: 0;
    }
  }
}
</style>
