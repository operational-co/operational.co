<template>
  <Modal klass="m-add-teammate" :active="active" @onClose="onClose" :closeable="closeable">
    <h3>Invite teammate</h3>
    <FormInvite @onSubmit="onSubmit"></FormInvite>
    <br />
    <p>Once invited, your teammate will receive an email asking them to join your project.</p>
    <p>If they accept the invite, they can view events and access the API key.</p>
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
    };
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    active: function () {
      if (!this.active) {
      }
    },
  },

  methods: {
    onSubmit: function () {
      this.$store.app.sendNotification({
        message: `Teammate invited!`,
        timer: 3000,
      });

      this.onClose();
    },
    onClose: function () {
      this.$emit("onClose");
    },
  },

  mounted: function () {},
};
</script>

<style lang="scss">
.m-add-teammate {
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
