<template>
  <div class="c-widget">
    <div class="c-widget__wrap">
      <Header :subtitle="subtitle"></Header>

      <div class="c-widget__inner">
        <Chart :data="data" :type="type"></Chart>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "@operational.co/components/chart/index.vue";
import Header from "./header.vue";

export default {
  components: {
    Chart,
    Header
  },

  props: {
    widget: {},
    type: {
      type: String,
      default: "line"
    }
  },

  computed: {
    subtitle: function () {
      let widget = this.widget;

      if (!widget) {
        return;
      }

      let widgetCache = widget.widgetCache;

      if (!widgetCache[0]) {
        return "N/A";
      }

      let createdAt = widgetCache[0].createdAt;

      let date = this.formatDate(createdAt);

      return date;
    },
    data: function () {
      let widget = this.widget;

      if (!widget) {
        return;
      }

      if (widget.widgetCache && widget.widgetCache[0]) {
        return widget.widgetCache[0].data;
      }

      return [];
    }
  },

  methods: {
    formatDate: function (isoDateString) {
      const date = new Date(isoDateString);
      const options = { month: "short" };
      const month = new Intl.DateTimeFormat("en-US", options).format(date);
      const day = date.getDate();
      const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

      return `${day}${suffix} ${month}`;
    }
  },

  mounted: function () {}
};
</script>

<style lang="scss">
.c-widget {
  position: relative;
  padding: var(--margin-lg);
  //height: 100%;

  &__wrap {
    background-color: var(--color-bg-2);
    border-radius: var(--border-radius);
    // box-shadow:
    //   0 20px 25px -5px rgb(0 0 0 / 0.3),
    //   0 8px 10px -6px rgb(0 0 0 / 0.1);

    border-bottom: var(--color-bg-3) solid 1px;
  }

  &__inner {
    padding: var(--margin-lg);
    padding-top: 0;
  }

  @media screen and (max-width: 576px) {
    border-radius: 0;
    //margin-top: var(--margin-lg);

    &__inner {
      padding: 0 var(--margin-lg);
      //padding: 0;
      //overflow-x: auto;

      min-height: 320px;

      .c-chart {
        //width: 600px;
      }
    }
  }
}
</style>
