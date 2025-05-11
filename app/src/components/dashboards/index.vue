<template>
  <div class="c-dashboards">
    <Constrain>
      <div class="c-dashboards__header">
        <h3>Dashboard</h3>
        <EditMode></EditMode>
      </div>
    </Constrain>
    <div class="c-dashboard">
      <div class="grid-stack">
        <div
          v-for="(w, i) in items"
          class="grid-stack-item grid-stack-item-content"
          :data-id="w.id"
          :gs-no-move="true"
          :gs-x="w.x"
          :gs-y="w.y"
          :gs-w="w.w"
          :gs-h="w.h"
          :gs-id="w.id"
          :id="w.id"
          :key="w.id"
        >
          <Widget></Widget>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import Constrain from "@operational.co/components/ui/constrain.vue";

import Widget from "@operational.co/components/widget/index.vue";

import { GridStack, GridStackEngine } from "gridstack";

import "gridstack/dist/gridstack.min.css";

import EditMode from "./edit-mode.vue";

export default {
  components: {
    Constrain,
    Widget,
    EditMode,
  },

  data: function () {
    return {
      grid: null,
      items: [
        { id: 1, x: 0, y: 0, w: 1 },
        { id: 2, x: 1, y: 0, w: 1 },
        { id: 3, x: 0, y: 2, w: 1 },
      ],
      search: {},
    };
  },

  computed: {
    // items: function () {
    //   return this.$store.reports.resources;
    // },
    computedItems: function () {
      return this.items;
    },
  },

  methods: {
    computeHeight: function () {
      let oneWidget = this.$el.querySelector(".c-widget");

      if (!oneWidget) {
        return;
      }

      let height = oneWidget.offsetHeight;

      console.log(height);

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
    });

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
    max-width: 1200px;
    padding: 0 var(--spacer);
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
    border-radius: var(--border-radius);
    //cursor: grab;
  }

  .grid-stack-item {
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
        padding: 0;
      }
    }
  }
}
</style>
