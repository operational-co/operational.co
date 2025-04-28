<template>
  <div class="c-settings-notifications">
    <Permission></Permission>
  </div>
</template>

<script>
import Permission from "./permission.vue";

export default {
  components: {
    Permission,
  },

  computed: {
    workspace: function () {
      return this.$store.workspace.resource;
    },
    users: function () {
      if (!this.workspace) {
        return [];
      }

      return this.workspace.users || [];
    },
  },
};
</script>

<style lang="scss">
.c-profile-item {
}
</style>
