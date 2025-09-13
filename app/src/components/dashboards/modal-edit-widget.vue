<template>
  <Modal klass="m-edit-widget" :active="active" @onClose="onClose" :closeable="closeable">
    <h2>Edit Widget</h2>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";
import FormCreateWorkspace from "@operational.co/components/form/form-create-workspace.vue";

import { workspaceApi } from "@/store/workspace.js";

export default {
  components: {
    Modal,
    Docs,
    FormCreateWorkspace,
  },

  data: function () {
    return {
      code: "",
      closeable: true,
      activated: false,
      error: false,
      active: false,
    };
  },

  watch: {
    editId: function () {
      if (this.editId) {
        this.active = true;
      } else {
        this.active = false;
      }
    },
  },

  computed: {
    editId: function () {
      return this.$store.dashboards.editId;
    },
    switchWorkspace: function () {},
  },

  methods: {
    onClose: function () {
      console.log("cock");
      this.$store.dashboards.setEdit(false);
    },
  },

  mounted: function () {},
};
</script>

<style lang="scss">
.m-create-workspace {
  .vfm__content {
    padding: var(--spacer-sm);
  }

  h2 {
    display: block;
  }
}
</style>
