<template>
  <div class="c-settings-section c-settings-workspace">
    <DemoWrap>
      <FormProject v-if="isAdmin(user.id)"></FormProject>
      <ManageUsers></ManageUsers>
      <section v-if="isAdmin(user.id)" class="c-delete-project">
        <h3>Delete project</h3>
        <p>Permanently delete this project and all associated data. This cannot be undone.</p>
        <button
          type="button"
          class="btn btn-danger"
          :disabled="!canDeleteProject"
          @click="modalDeleteProject = true"
        >
          Delete project
        </button>
        <small v-if="!canDeleteProject">Create another project before deleting this one.</small>
      </section>
    </DemoWrap>
    <ModalDeleteProject
      :active="modalDeleteProject"
      :canDelete="canDeleteProject"
      @onClose="modalDeleteProject = false"
    ></ModalDeleteProject>
  </div>
</template>

<script>
import FormProject from "@operational.co/components/form/form-project.vue";

import DemoWrap from "@/components/app/demo-wrap.vue";

import ManageUsers from "./manage-users.vue";
import ModalDeleteProject from "./modal-delete-project.vue";

export default {
  components: {
    FormProject,
    DemoWrap,
    ManageUsers,
    ModalDeleteProject,
  },

  data: function () {
    return {
      modalDeleteProject: false,
    };
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
    ownedProjectCount: function () {
      const workspaces = this.user.workspaces || [];
      let count = 0;

      for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces[i];
        if (workspace.adminId === this.user.id && workspace.status !== "DELETED") {
          count++;
        }
      }

      return count;
    },
    canDeleteProject: function () {
      return this.ownedProjectCount > 1;
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

.c-delete-project {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: var(--color-bg-5) solid 1px;

  p {
    margin-bottom: 0.75rem;
  }

  small {
    display: block;
    margin-top: 0.5rem;
  }
}
</style>
