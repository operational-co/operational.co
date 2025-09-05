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
      if (this.widget.type === "STAT") {
        return;
      }
      let datas = toRaw(this.widget.data);

      datas = datas.filter((d) => {
        if (d.data) {
          return true;
        }
        return false;
      });

      datas = datas.map((d) => {
        d.data = d.data.map((datum) => {
          datum.x = moment(datum.x).format("MMM Do");
          datum.label = `${datum.y} user signups`;
          return datum;
        });
        let obj = {
          //color: "#777",
          data: d.data,
        };
        return obj;
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
          console.log(dataSelectors[0]);
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
