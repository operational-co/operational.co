<template>
  <div class="c-picker">
    <Constrain>
      <div class="c-picker__inner">
        <Breadcrumb></Breadcrumb>

        <transition name="page-fade" mode="out-in">
          <component
            :is="currentPageComponent"
            :type="type"
            :dashboardId="currentDashboard.id"
            @onSelect="onSelect"
            @onClose="onClose"
            key="currentPage"
          ></component>
        </transition>
      </div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import DataSelector from "./data-selector.vue";
import SchemaLine from "./schema-line.vue";
import SchemaStat from "./schema-stat.vue";
import SchemaAction from "./schema-action.vue";
import Header from "./header.vue";
import Breadcrumb from "./breadcrumb.vue";
import Webhook from "./webhook.vue";

import PageSelect from "./page-select.vue";
import PageCustomize from "./page-customize.vue";

export default {
  components: {
    Constrain,
    DataSelector,
    SchemaLine,
    SchemaStat,
    SchemaAction,
    Header,
    Breadcrumb,
    Webhook,

    PageSelect,
    PageCustomize,
  },

  data: function () {
    return {
      type: "",
      source: "EVENTS",
      width: 4,

      pages: ["PageSelect", "PageCustomize"],
      currentPageIndex: 0,
    };
  },

  watch: {
    type: function () {
      if (this.type) {
        this.currentPageIndex = 1;
      }
    },
  },

  computed: {
    currentPageComponent() {
      return this.pages[this.currentPageIndex];
    },
    dashboards: function () {
      return this.$store.dashboards.resources;
    },
    // will need to rectify this in the future
    currentDashboard: function () {
      return this.dashboards[0];
    },
    limit: function () {
      let limit = 0;
      if (this.type === "line") {
        limit = 4;
      }
      if (this.type === "bar") {
        limit = 2;
      }
      if (this.type === "stat") {
        limit = 1;
      }
      return limit;
    },
    isMax: function () {
      if (this.dataSelectors.length === this.limit) {
        return true;
      }
      return false;
    },
    summary: function () {
      let chartType = this.type;
      let dataSelectors = this.dataSelectors;
      let lines = [];
      let line1 = `This ${chartType} will show ${dataSelectors.length} datasets where:`;
      lines.push(line1);
      for (let i = 0; i < dataSelectors.length; i++) {
        let dataSelector = dataSelectors[i];

        let condition = dataSelector.condition;
        if (condition === "=") {
          condition = "is";
        } else {
          condition = "is not";
        }

        let line = `${i + 1}) Data where ${dataSelector.selector} ${condition} "${dataSelector.text}"`;
        lines.push(line);
      }

      lines = lines.join(`\n`);

      return lines;
    },
  },

  methods: {
    onSelect: function (type) {
      this.type = type;
    },
    onSave: function () {
      // validate here
    },
    onAdd: function () {
      this.dataSelectors.push({
        selector: "event",
        condition: "=",
        text: "",
      });
    },
    onDelete: function (i) {
      console.log(i);
      this.dataSelectors.splice(i, 1);
    },
    onUpdate: function (data) {
      console.log(data);
      let newObj = {
        ...data,
      };
      delete newObj.i;
      this.dataSelectors.splice(data.i, 1, newObj);
    },
    onSelectChart: function (type) {
      this.type = type;
    },
    onClose: function () {
      this.$emit("onClose");
    },
    allowAdd: function (dataSelector, i) {
      if (this.isMax) {
        return false;
      }
      if (this.dataSelectors.length === i + 1) {
        return true;
      }
      return false;
    },
    allowDelete: function (dataSelector, i) {
      if (i === 0) {
        return false;
      }

      return true;
    },
  },
};
</script>

<style lang="scss">
.c-picker {
  &__inner {
    position: relative;
  }

  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: all 0.3s ease;
    position: absolute;
    width: 100%;
  }

  .page-fade-enter-from {
    opacity: 0;
    transform: translateX(50px);
  }
  .page-fade-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  .page-fade-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .page-fade-leave-to {
    opacity: 0;
    transform: translateX(-50px);
  }
}
</style>
