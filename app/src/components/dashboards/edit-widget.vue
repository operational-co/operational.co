<template>
  <div class="c-dashboards-edit-widget">
    <h3>Edit widget</h3>
    <SchemaLine v-if="editId" :widgetId="editId"></SchemaLine>
  </div>
</template>

<script>
import SchemaLine from "@/components/picker/schema-line.vue";

export default {
  components: {
    SchemaLine,
  },

  computed: {
    editId: function () {
      return this.$store.dashboards.editId;
    },
  },
};
</script>

<style lang="scss">
.c-dashboards-edit-widget {
  padding: 1.5rem;
}
</style>
