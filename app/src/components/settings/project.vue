<template>
  <div class="c-settings-section c-settings-workspace">
    <DemoWrap>
      <FormProject v-if="isAdmin(user.id)"></FormProject>
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
    user: function () {
      return this.$store.user.resource;
    },
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

  methods: {
    isAdmin: function (userId) {
      let workspace = this.workspace;

      if (workspace.adminId === userId) {
        return true;
      }

      return false;
    },
  },
};
</script>

<style lang="scss">
.c-profile-item {
}
</style>
