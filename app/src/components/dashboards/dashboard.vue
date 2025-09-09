<template>
  <div :class="['c-dashboard', { moving: moving === true }]" v-if="dashboard">
    <div class="c-dashboard__wrap" v-if="widgets.length > 0">
      <div class="grid-stack">
        <div
          v-for="widget in widgets"
          class="grid-stack-item grid-stack-item-content"
          :data-id="widget.id"
          :gs-x="widget.x"
          :gs-y="widget.y"
          :gs-w="widget.w"
          :gs-h="widget.h"
          :gs-id="widget.id"
          :id="widget.id"
          :key="widget.id"
        >
          <Widget
            :dashboardId="dashboard.id"
            :moving="moving"
            :widget="widget"
            @onRemove="onRemove(widget)"
          ></Widget>
        </div>
      </div>
    </div>
    <div class="c-dashboard__empty-state" v-if="widgets.length === 0">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5097 3.27576C11.8142 3.10453 12.1858 3.10453 12.4903 3.27576L19.4903 7.21322C19.8052 7.39033 20 7.72352 20 8.08479V15.9151C20 16.2764 19.8052 16.6096 19.4903 16.7867L12.4902 20.7241C12.1858 20.8953 11.8142 20.8953 11.5097 20.7241L4.50977 16.787C4.19487 16.6098 4 16.2766 4 15.9154L4 8.08477C4 7.72349 4.19486 7.39031 4.50975 7.21319L11.5097 3.27576Z"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M15 12C15 13.6568 13.6569 15 12 15C10.3432 15 9.00003 13.6568 9.00003 12C9.00003 10.3431 10.3432 9 12 9C13.6569 9 15 10.3431 15 12Z"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
      </svg>

      <p>Your dashboard is empty. Add a widget to get started.</p>
      <router-link to="/picker" class="btn btn-primary"> Add widget </router-link>
    </div>
  </div>
</template>

<script>
import Widget from "@/components/widget/index.vue";
import { GridStack, GridStackEngine } from "gridstack";

import "gridstack/dist/gridstack.min.css";

import { dashboardsApi } from "@/store/dashboards.js";

import { toRaw } from "vue";

export default {
  components: {
    Widget,
  },

  data: function () {
    return {
      grid: null,
    };
  },

  props: {
    dashboard: {},
  },

  watch: {
    widgets: {
      handler: function () {
        let widgets = this.widgets;
        let rowCount = Math.round(widgets.length / 2);
        if (this.grid) {
          this.grid.updateOptions({
            row: rowCount,
          });
        }
      },
      immediate: true,
    },
  },

  computed: {
    widgets: function () {
      let widgets = this.dashboard.widgets;

      widgets = widgets.map((widget) => {
        return widget;
      });

      return widgets.slice();
    },
    moving: function () {
      return this.$store.app.moveMode;
    },
    dataMove: function () {
      if (this.moving) {
        return "yes";
      }
      return false;
    },
  },

  methods: {
    onRemove: async function (widget) {
      let form = {
        widgetId: widget.id,
        dashboardId: this.dashboard.id,
      };
      let widgets = this.dashboard.widgets;
      const i = widgets.findIndex((w) => String(w.id) === String(widget.id));

      this.dashboard.widgets.splice(i, 1);

      const result = await this.$store.dashboards.removeWidget(form);
    },
    onStopEdit: function () {
      this.$store.app.setMoveMode(false);
    },
    onEdit: function () {
      this.$store.app.setMoveMode(true);
    },
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

    async onGridUpdate(e) {
      let widgets = this.grid.engine.nodes;

      widgets = widgets.map((widget) => {
        return {
          id: parseInt(widget.id),
          x: widget.x,
          y: widget.y,
        };
      });

      const condition = await this.$store.dashboards.updateWidgets(this.dashboard.id, widgets);

      console.log(condition);
    },

    setupGrid: function () {
      const height = `177px`; //this.computeHeight();
      this.grid = GridStack.init({
        float: false,
        column: 4,
        columnOpts: {
          layout: "none",
          breakpointForWindow: true,
          breakpoints: [
            { w: 750, c: 2 },
            { w: 10000, c: 4 },
          ],
        },
        disableResize: true,
        cellHeight: height,
        cellHeightThrottle: 1000,
        acceptWidgets: false,
        resizable: false,
        subGridDynamic: false,
        layout: "list",
        handleClass: "c-widget__handle",
        //staticGrid: !this.moving,
      });

      //this.grid.on("change", this.onGridUpdate);

      let widgets = this.widgets;
      let rowCount = Math.round(widgets.length / 2);

      this.grid.updateOptions({
        row: rowCount,
      });
    },
  },

  mounted: async function () {
    if (this.dashboard) {
      this.setupGrid();
    }
  },
};
</script>

<style lang="scss">
.c-dashboard {
  max-width: 740px;

  margin: 0 auto;

  &__empty-state {
    text-align: center;
    svg {
      display: inline-block;
      width: 48px;
      height: 48px;
    }
  }

  &__wrap {
    padding: 4px;
    width: 100%;
    border-radius: 12px;
    width: 100%;
    transition: all var(--transition-time) linear;
  }

  &__grid {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .grid-stack-placeholder {
    > .placeholder-content {
      border: 3px dashed var(--color-bg-4);
      border-radius: 0.5rem;
      margin: 0;
      position: absolute;
      top: var(--margin);
      left: var(--margin);
      right: var(--margin);
      bottom: var(--margin);
      width: auto;
      z-index: 0 !important;
      text-align: center;
    }
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

  .gs-4 > .grid-stack-item {
    width: 25%;
  }
  .gs-4 > .grid-stack-item[gs-w="2"] {
    width: 50%;
  }
  .gs-4 > .grid-stack-item[gs-w="3"] {
    width: 75%;
  }
  .gs-4 > .grid-stack-item[gs-w="4"] {
    width: 100%;
  }

  .grid-stack-item {
    padding: var(--margin);

    &.ui-draggable-dragging {
      .c-widget {
        box-shadow: rgb(0, 0, 0) 0px 8px 30px -10px;
      }
    }
  }

  &.moving {
    .c-dashboard__wrap {
      background-color: var(--color-bg-3);
    }
  }

  @media screen and (max-width: 576px) {
    padding-top: var(--margin-lg);
    padding: 0;
    width: 100%;
    margin: 0 auto;

    &__wrap {
      border-radius: 0;
    }
  }
}
</style>
