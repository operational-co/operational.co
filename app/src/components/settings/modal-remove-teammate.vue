<template>
  <Modal klass="m-remove-teammate" :active="active" @onClose="onClose" :closeable="closeable">
    <h3>Remove teammate from project</h3>
    <p>Are you sure you want to remove your teammate?</p>
    <p>Any data they might have created will go under your account.</p>
    <a class="btn btn-danger" @click.prevent="onRemoveTeammate">
      <span v-if="processing" class="c-spinner"></span>
      <span
        >Yes, remove <template v-if="user">{{ user.email }}</template></span
      >
    </a>
    <p v-if="error">
      {{ error }}
    </p>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";

import FormInvite from "@operational.co/components/form/form-invite.vue";

import { workspaceApi } from "@/store/workspace.js";

export default {
  components: {
    Modal,
    Docs,
    FormInvite,
  },

  data: function () {
    return {
      code: "",
      closeable: true,
      activated: false,
      error: false,
      processing: false,
    };
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    userId: {},
  },

  watch: {
    active: function () {
      if (!this.active) {
      }
    },
  },

  computed: {
    workspace: function () {
      return this.$store.workspace.resource;
    },
    users: function () {
      if (!this.workspace) {
        return [];
      }

      return this.workspace.users.reverse() || [];
    },
    user: function () {
      let userId = this.userId;
      let u = null;
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.id === userId) {
          u = user;
          break;
        }
      }

      return u;
    },
  },

  methods: {
    async onRemoveTeammate() {
      this.processing = true;

      try {
        await this.$store.workspace.removeUser({
          userId: this.user.id,
        });

        this.$store.app.sendNotification({
          message: `Teammate removed from project`,
          timer: 3000,
        });

        this.processing = false;

        this.onClose();
      } catch (err) {
        console.log(err);
        this.error = err;

        this.processing = false;
      }
    },
    onClose: function () {
      this.$emit("onClose");
    },
  },

  mounted: function () {},
};
</script>

<style lang="scss">
.m-remove-teammate {
  .vfm__content {
    padding: var(--spacer-sm);
    width: 500px;
  }

  h3 {
    user-select: none;
    width: calc(100% - var(--spacer-lg));
  }

  h2 {
    text-align: center;
  }
}
</style>
