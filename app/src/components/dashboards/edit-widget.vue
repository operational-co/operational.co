<template>
  <div class="c-dashboards-edit-widget">
    <h3>Edit widget</h3>
    {{ currentWidget }}
    <template v-if="editId">
      <!-- <Webhook></Webhook> -->
      <SchemaLine :currentWidget="currentWidget" :widgetId="editId"></SchemaLine>
    </template>
  </div>
</template>

<script>
import Webhook from "@/components/picker/webhook.vue";
import SchemaLine from "@/components/picker/schema-line.vue";

export default {
  components: {
    Webhook,
    SchemaLine,
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
