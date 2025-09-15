<template>
  <div class="c-dashboards-edit-widget">
    <h3>Edit widget</h3>
    <template v-if="editId && currentWidget">
      <!-- <Webhook></Webhook> -->
      {{ currentWidget.type }}
      <SchemaLine
        v-if="currentWidget.type === 'LINE'"
        :currentWidget="currentWidget"
        :widgetId="editId"
      ></SchemaLine>
      <SchemaStat
        v-if="currentWidget.type === 'STAT'"
        :currentWidget="currentWidget"
        :widgetId="editId"
      ></SchemaStat>
      <SchemaAction
        v-if="currentWidget.type === 'ACTION'"
        :currentWidget="currentWidget"
        :widgetId="editId"
      ></SchemaAction>
    </template>
  </div>
</template>

<script>
import Webhook from "@/components/picker/webhook.vue";
import SchemaLine from "@/components/picker/schema-line.vue";
import SchemaStat from "@/components/picker/schema-stat.vue";
import SchemaAction from "@/components/picker/schema-action.vue";

export default {
  components: {
    Webhook,
    SchemaLine,
    SchemaStat,
    SchemaAction,
  },

  computed: {
    editId: function () {
      return this.$store.dashboards.editId;
    },
    currentDashboard: function () {
      return this.$store.dashboards.currentDashboard;
    },
    currentWidget: function () {
      if (!this.currentDashboard) {
        console.log("no current dashboard");
        return;
      }
      let widgets = this.currentDashboard.widgets || [];
      const editId = this.editId;
      let widget = null;

      for (let i = 0; i < widgets.length; i++) {
        const w = widgets[i];
        if (w.id === editId) {
          widget = w;
          break;
        }
      }

      return widget;
    },
  },
};
</script>

<style lang="scss">
.c-dashboards-edit-widget {
  padding: 1.5rem;
}
</style>
