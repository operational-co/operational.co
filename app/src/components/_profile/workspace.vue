<template>
  <div class="c-profile-workspace">
    <h3>Workspace</h3>
    <p>Manage your workspace. Add users, remove users, etc.</p>

    {{ workspace }}

    <div class="c-profile-item" v-for="workspaceUser in user">{{ workspaceUser }}</div>
    <ModalProfileUser :active="false"></ModalProfileUser>
  </div>
</template>

<script>
import ModalProfileUser from "./modal-profile-user.vue";

export default {
  components: {
    ModalProfileUser,
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
