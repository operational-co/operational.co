<template>
  <div :class="['c-picker-preview', { lg: type === 'LINE' ? true : false }]">
    <Widget :widget="fakeWidget"></Widget>
  </div>
</template>

<script>
import Widget from "@/components/widget/index.vue";
export default {
  components: {
    Widget,
  },

  props: {
    schema: {},
    type: {},
  },

  computed: {
    widgetData: function () {
      let out = null;

      if (this.type === "STAT") {
        out = Math.round(Math.random() * 100) + 10;
      }

      if (this.type === "LINE") {
        let days = 7;
        if (this.schema && typeof this.schema.date === "string") {
          const s = this.schema.date.toLowerCase();
          if (s.includes("year")) days = 365;
          else {
            const n = parseInt(s, 10);
            if (!isNaN(n)) days = n;
          }
        }

        // selectors (at least one)
        let selectors = Array.isArray(this.schema?.dataSelectors) ? this.schema.dataSelectors : [];
        if (!selectors.length) selectors = [{ selector: "event" }];

        // start at today 00:00Z minus (days-1)
        const now = new Date();
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        start.setUTCDate(start.getUTCDate() - (days - 1));

        function isoMidnightUTC(d) {
          return new Date(
            Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
          ).toISOString();
        }

        out = [];
        for (let s = 0; s < selectors.length; s++) {
          const points = [];
          for (let i = 0; i < days; i++) {
            const d = new Date(start.getTime());
            d.setUTCDate(d.getUTCDate() + i);
            const x = isoMidnightUTC(d);
            const y = Math.floor(Math.random() * 100) + 40;
            points.push({ x: x, y: y });
          }
          out.push({ data: points });
        }
      }

      return out;
    },
    fakeWidget: function () {
      let widgetData = this.widgetData;
      let obj = {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: this.type,
        schema: { ...this.schema },

        data: widgetData,
      };
      return obj;
    },
  },
};
</script>

<style lang="scss">
.c-picker-preview {
  width: 340px;
  height: 340px;
  background-color: var(--color-bg-4);
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .c-widget {
    width: 170px;
    height: 170px;
  }

  &.lg {
    .c-widget {
      width: 340px;
      height: 340px;
    }
  }
}
</style>
