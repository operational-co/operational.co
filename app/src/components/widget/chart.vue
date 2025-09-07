<template>
  <div class="c-widget-chart">
    <Header :title="subtitle" :metric="`3,754`" :subtitle="subtitle"></Header>

    <div class="c-widget__inner">
      <Chart :data="data" :type="widget.type"></Chart>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/chart/index.vue";
import Header from "./header.vue";

import { toRaw } from "vue";

import moment from "moment";

export default {
  components: {
    Chart,
    Header,
  },

  props: {
    widget: {},
  },

  computed: {
    data: function () {
      if (this.widget.type === "STAT") return;

      const src = this.widget?.data || [];

      const datas = src
        .filter((d) => Array.isArray(d.data) && d.data.length)
        .map((d) => {
          let acc = 0;

          const points = d.data.map((datum) => {
            const baseY = Number(datum.y) || 0;
            const isInc = String(d.aggregate || "").toUpperCase() === "INCREMENTAL";
            const y = isInc ? (acc += baseY) : baseY;

            return {
              x: moment(datum.x).format("MMM Do"),
              y,
              // keep your existing label wording
              label: `${y} user signups`,
            };
          });

          return { data: points };
        });

      return datas;
    },
    subtitle: function () {
      let widget = this.widget;

      if (!widget) {
        return;
      }

      let dataSelectors = widget.schema.dataSelectors;
      if (dataSelectors) {
        if (dataSelectors.length === 1) {
          return dataSelectors[0].text;
        }
      }

      return "tbc";
    },
  },
};
</script>

<style lang="scss">
.c-widget-chart {
}
</style>
