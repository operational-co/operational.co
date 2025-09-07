<template>
  <div class="c-chart">
    <Bar v-if="type === 'BAR'" :data="data"></Bar>
    <Line v-if="type === 'LINE'" :datasets="datasets"></Line>
    <Stat v-if="type === 'STATS'"></Stat>
  </div>
</template>

<script>
import Bar from "./bar.vue";
import Axis from "./axis.vue";
import Info from "./info.vue";
import Line from "./line.vue";
import Stat from "./stat.vue";

export default {
  components: {
    Bar,
    Axis,
    Info,
    Line,
    Stat,
  },

  data: function () {
    return {};
  },

  props: {
    title: {
      default: "New Subscribers",
    },
    type: {
      type: String,
      default: "LINE",
    },
    data: {
      default: function () {
        return [];
      },
    },
  },

  computed: {
    datasets: function () {
      let datas = this.data;

      return datas;
    },
    // data: function () {
    //   let points = 14;
    //   let data = [];
    //   for (let i = 0; i < points; i++) {
    //     let obj = {
    //       x: i,
    //       y: Math.floor(Math.random() * 51),
    //     };
    //     data.push(obj);
    //   }
    //   return data;
    // },
  },
};
</script>

<style lang="scss">
.c-chart {
  height: 240px;
  width: 100%;
  //margin-bottom: var(--spacer);
  //padding-bottom: calc(var(--spacer) * 1);
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
