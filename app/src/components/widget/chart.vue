<template>
  <div class="c-widget-chart">
    <Header :title="title" :subtitle="subtitle"></Header>

    <div class="c-widget__inner">
      <Chart v-if="data" :data="data" :type="widget.type"></Chart>
      <span v-else> No data </span>
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
    title: function () {
      if (!this.widget.data) {
        return;
      }

      if (this.widget.type === "STAT") return;

      const source = this.widget.source;
      const schema = this.widget.schema || {};
      let condition = schema.total || "TOTAL";
      let value = 0;

      if (source === "PUSH") {
        return this.widget.data.title || "";
      }

      if (this.widget.data.length === 0) {
        return;
      }

      if (condition === "TOTAL") {
        let primaryData = this.widget.data[0];

        let dataset = primaryData.data;

        for (let i = 0; i < dataset.length; i++) {
          const datum = dataset[i];

          value += datum.y;
        }
      }

      if (condition === "AVERAGE") {
        let primaryData = this.widget.data[0];

        let dataset = primaryData.data;

        value = dataset.reduce((acc, obj) => acc + (obj.y || 0), 0);

        value = value / dataset.length;
      }

      return value;
    },
    data: function () {
      if (!this.widget.data) {
        return;
      }
      if (this.widget.data.length === 0) {
        return;
      }
      if (this.widget.type === "STAT") return;

      const source = this.widget.source;

      const aggregate = this.widget.schema.aggregate || "CUMULATIVE";

      let src = [];

      if (source === "EVENTS") {
        src = this.widget?.data || [];
      }
      if (source === "PUSH") {
        src = this.widget.data.datasets || [];
      }

      const datas = src
        .filter((d) => Array.isArray(d.data) && d.data.length)
        .map((d) => {
          let acc = 0;

          const isInc = aggregate === "INCREMENTAL";

          const points = d.data.map((datum) => {
            let label = datum.label;

            const baseY = Number(datum.y) || 0;

            const y = isInc ? (acc += baseY) : baseY;

            if (!label) {
              label = `${y} ${d.text}`;
            }

            return {
              x: moment(datum.x).format("MMM Do"),
              y,
              // keep your existing label wording
              label: label,
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

      if (widget.source === "PUSH") {
        return widget.data.subtitle || {};
      }

      let dataSelectors = widget.schema.dataSelectors;
      if (dataSelectors) {
        if (dataSelectors.length === 1) {
          return dataSelectors[0].text;
        }
      }

      return "";
    },
  },

  methods: {
    formatNumberWithCommas(value) {
      // Ensure it's a number first
      const number = typeof value === "number" ? value : parseInt(value, 10);

      // If it's not a valid number, return the original value
      if (isNaN(number)) return value;

      // Format with commas
      return number.toLocaleString("en-US");
    },
  },
};
</script>

<style lang="scss">
.c-widget-chart {
}
</style>
