<template>
  <div class="c-chart">
    <!-- <Info :title="title"></Info>
    <Bar :data="data"></Bar>
    <Axis :data="data"></Axis> -->
    <Area :data="data"></Area>
  </div>
</template>

<script>
import Bar from "./bar.vue";
import Axis from "./axis.vue";
import Info from "./info.vue";
import Area from "./area.vue";

export default {
  components: {
    Bar,
    Axis,
    Info,
    Area
  },

  data: function () {
    return {};
  },

  props: {
    title: {
      default: "New Subscribers"
    }
    // data: {
    //   default: function () {
    //     return [];
    //   },
    // },
  },

  computed: {
    data: function () {
      let points = 30;
      let data = [];
      for (let i = 0; i < points; i++) {
        let obj = {
          x: i,
          y: Math.floor(Math.random() * 51)
        };
        data.push(obj);
      }
      return data;
    }
  }
};
</script>

<style lang="scss">
.c-chart {
  height: 300px;
  width: 100%;
  margin-bottom: var(--spacer);
  padding-bottom: calc(var(--spacer) * 1);
  --hue: var(--hue-p);

  --chart-color: hsl(var(--hue), 70%, 53%);
  --chart-color-light: hsl(var(--hue), 70%, 60%);

  --chart-color-secondary: hsl(5, 70%, 53%);
  --chart-color-secondary-light: hsl(5, 70%, 60%);

  .c-chart-points {
    height: 100%;
  }

  @media screen and (max-width: 576px) {
    margin-bottom: 0;
  }
}
</style>
