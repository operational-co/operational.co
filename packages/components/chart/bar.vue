<template>
  <div class="c-chart-points c-chart-bar">
    <div v-for="(item, i) in data" :key="i" :data-title="item.y">
      <span :style="computeStyle(item)"></span>
      <span :style="computeStyle(item, true)"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: function () {
        return [];
      }
    }
  },

  computed: {
    width: function () {
      let count = this.data.length;
      // Define the rate at which y decreases as x increases
      const decreaseRate = 2.8; // Adjust this value as needed
      const minimumY = 4;
      const maximumY = 60;

      // Calculate y based on the decreaseRate
      let y = 100 - decreaseRate * count;

      // Ensure y stays within the specified range
      y = Math.max(minimumY, Math.min(maximumY, y));

      return y;
    },
    maxY: function () {
      let maxYValue = this.data.reduce((max, obj) => (obj.y > max ? obj.y : max), -Infinity);

      return maxYValue;
    }
  },

  methods: {
    mapValueToRange(value, min1, max1, min2, max2) {
      return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
    },
    computeStyle: function (item, invert = false) {
      let diff = this.mapValueToRange(item.y, 0, this.maxY, 0, 100);

      if (invert) {
        diff = 100 - diff;
      }

      return {
        //width: `${this.width}px`,
        height: `${diff}%`
      };
    }
  }
};
</script>

<style lang="scss">
.c-chart-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  > div {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-column-gap: 2px;
    align-items: end;
    position: relative;
    padding: 0 6px;

    height: 100%;
    width: 100%;

    &:after {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      padding: var(--margin-sm) var(--margin);
      content: attr(data-title);

      font-size: var(--font-size-xs);
      line-height: 1;
      background-color: var(--color-bg-3);
      border-radius: var(--border-radius);
      opacity: 0;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }

    > span {
      display: block;
      width: 100%;
      background: linear-gradient(0deg, var(--chart-color) 0%, var(--chart-color-light) 100%);
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;

      &:last-child {
        background: linear-gradient(0deg, var(--chart-color-secondary) 0%, var(--chart-color-secondary-light) 100%);
      }
    }
  }

  @media screen and (max-width: 576px) {
    > div {
      padding: 0 var(--margin-sm);
    }
  }
}
</style>
