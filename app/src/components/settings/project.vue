<template>
  <div class="c-settings-section c-settings-workspace">
    <DemoWrap>
      <FormProject></FormProject>
      <ManageUsers></ManageUsers>
    </DemoWrap>
  </div>
</template>

<script>
import FormProject from "@operational.co/components/form/form-project.vue";

import DemoWrap from "@/components/app/demo-wrap.vue";

import ManageUsers from "./manage-users.vue";

export default {
  components: {
    FormProject,
    DemoWrap,
    ManageUsers,
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
