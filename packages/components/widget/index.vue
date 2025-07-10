<template>
  <div :class="['c-widget', { moving: moving === true }]">
    <div class="c-widget__wrap">
      <!-- <Header :subtitle="subtitle"></Header>

      <div class="c-widget__inner">
        <Chart :data="data" :type="widget.type"></Chart>
      </div> -->
      <Number :data="widget.data"></Number>
    </div>
  </div>
</template>

<script>
import Chart from "@operational.co/components/chart/index.vue";
import Header from "./header.vue";
import Number from "./number.vue";

export default {
  components: {
    Chart,
    Header,
    Number
  },

  props: {
    widget: {},
    moving: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    subtitle: function () {
      let widget = this.widget;

      if (!widget) {
        return;
      }

      return "nanana";

      let widgetCache = widget.widgetCache;

      if (!widgetCache[0]) {
        return "N/A";
      }

      let createdAt = widgetCache[0].createdAt;

      let date = this.formatDate(createdAt);

      return date;
    },
    data: function () {
      return [];
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
  height: 100%;

  &__wrap {
    height: 100%;
  }

  &__inner {
    padding: var(--margin-lg);
    padding-top: 0;
  }

  @keyframes jiggle {
    0% {
      transform: rotate(-2deg);
    }
    25% {
      transform: rotate(2deg);
    }
    50% {
      transform: rotate(-2deg);
    }
    75% {
      transform: rotate(2deg);
    }
    100% {
      transform: rotate(-2deg);
    }
  }

  &.moving {
    animation: jiggle 800ms infinite;
    animation-timing-function: ease-in-out;
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
