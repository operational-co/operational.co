<template>
  <div class="c-dashboards">
    <Constrain>
      <div class="c-dashboards__header">
        <h3>Dashboard</h3>
        <EditMode v-model="moving"></EditMode>
      </div>
    </Constrain>
    <div class="c-dashboard">
      <div class="grid-stack">
        <div
          v-for="(item, i) in computedItems"
          class="grid-stack-item grid-stack-item-content"
          :data-id="item.id"
          :gs-x="item.x"
          :gs-y="item.y"
          :gs-w="item.w"
          :gs-h="item.h"
          :gs-id="item.id"
          :id="item.id"
          :key="item.id"
        >
          <Widget :moving="moving" :widget="item.widget"></Widget>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Widget from "@operational.co/components/widget/index.vue";
import { GridStack, GridStackEngine } from "gridstack";
import EditMode from "./edit-mode.vue";

import "gridstack/dist/gridstack.min.css";

export default {
  components: {
    Constrain,
    Widget,
    EditMode,
  },

  data: function () {
    return {
      grid: null,
      moving: false,
      widgets: [
        {
          id: 1,
          type: "number",
          data: {
            title: "$577",
            description: "Today",
          },
          meta: {
            x: 0,
            y: 0,
            w: 1,
            y: 1,
          },
        },
        {
          id: 1,
          type: "number",
          data: {
            title: "56 signups",
            description: "Today",
          },
          meta: {
            x: 1,
            y: 0,
            w: 1,
            y: 1,
          },
        },
        {
          id: 1,
          type: "number",
          data: {
            title: "2 Posts",
            description: "Today",
          },
          meta: {
            x: 0,
            y: 1,
            w: 1,
            y: 1,
          },
        },
      ],
      search: {},
    };
  },

  watch: {
    moving: {
      immediate: true,
      handler(val) {
        if (this.grid) {
          this.grid.setStatic(!val);
        }
      },
    },
  },

  computed: {
    dataMove: function () {
      if (this.moving) {
        return "yes";
      }
      return false;
    },
    // items: function () {
    //   return this.$store.reports.resources;
    // },
    computedItems: function () {
      const widgets = this.widgets;
      const items = [];

      for (let i = 0; i < widgets.length; i++) {
        const w = widgets[i];

        items.push({
          w: w.meta.w,
          h: w.meta.h,
          x: w.meta.x,
          y: w.meta.y,
          id: w.id,
          widget: w,
        });
      }

      return items;
    },
  },

  methods: {
    computeHeight: function () {
      let oneWidget = this.$el.querySelector(".c-widget");

      if (!oneWidget) {
        return;
      }

      let height = oneWidget.offsetHeight;

      if (!this.grid) {
        return height;
      }

      this.grid.cellHeight(height);
    },
  },

  mounted: function () {
    const height = this.computeHeight();
    this.grid = GridStack.init({
      float: false,
      minRow: 1,
      maxRow: 3,
      column: 2,
      disableResize: true,
      cellHeight: height,
      cellHeightThrottle: 1000,
      //staticGrid: !this.moving,
    });

    this.grid.on("change", (event, items) => {
      console.log("Grid changed:", items);
      // Example output: [{x: 0, y: 0, w: 1, h: 1, id: 'some-id'}, ...]
    });

    this.grid.setStatic(!this.moving);

    // setInterval(() => {
    //   this.computeHeight();
    // }, 1000);

    // this.$nextTick(() => {
    //   this.computeHeight();
    // });

    // const items = [
    //   { id: 1, x: 1, y: 1, h: 1 },
    //   { id: 2, x: 2, y: 1, w: 1 },
    // ];

    // grid.load(items);
  },
};
</script>

<style lang="scss">
.c-dashboards {
  .c-dashboard {
    max-width: 740px;
    margin: var(--spacer-sm) auto;

    border-radius: 20px;
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;

    h3 {
      margin-bottom: 0;
    }

    .c-dashboards-edit-mode {
      margin-left: auto;
    }

    > a {
      margin-left: auto;
      font-weight: 500;
      font-family: var(--font-family-monospace);
      font-size: var(--font-size-sm);
    }
  }

  &__grid {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .c-constrain {
    &__inner {
      > h1 {
        font-weight: 600;
        margin-bottom: 0;
        user-select: none;
      }
    }
  }

  .grid-stack {
    width: 100%;
    margin-left: var(--margin);
    margin-right: var(--margin);
    width: calc(100% - var(--margin) * 2);
    // margin-left: calc(var(--margin-lg) * -1);
    //margin-right: calc(var(--margin-lg) * -1);
  }

  .gs-2 > .grid-stack-item[gs-x="1"] {
    left: 0%;
  }
  .gs-2 > .grid-stack-item[gs-x="1"] {
    left: 50%;
  }

  .gs-2 > .grid-stack-item {
    width: 50%;
  }
  .gs-2 > .grid-stack-item[gs-w="2"] {
    width: 100%;
  }

  .grid-stack-item-content {
    //padding: var(--margin);
    //background-color: #18bc9c;
    //padding: var(--spacer-lg);
    //cursor: grab;
  }

  .grid-stack-item {
    padding: var(--margin);

    &.ui-draggable-dragging {
      .c-widget {
        box-shadow: rgb(0, 0, 0) 0px 8px 30px -10px;
      }
    }
  }

  @media screen and (max-width: 576px) {
    padding-top: var(--margin-lg);

    .c-dashboard {
      padding: 0;
      width: 100%;

      .grid-stack-item {
      }
    }
  }
}
</style>
