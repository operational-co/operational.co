<template>
  <Modal klass="m-edit-widget" :active="active" @onClose="onClose" :closeable="closeable">
    <EditWidget></EditWidget>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";
import FormCreateWorkspace from "@operational.co/components/form/form-create-workspace.vue";

import { workspaceApi } from "@/store/workspace.js";

import EditWidget from "./edit-widget.vue";

export default {
  components: {
    Modal,
    Docs,
    FormCreateWorkspace,
    EditWidget,
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
  },

  methods: {
    onClose: function () {
      this.$store.dashboards.setEdit(false);
    },
  },

  mounted: function () {},
};
</script>

<style lang="scss">
.m-edit-widget {
  .vfm__content {
    padding: var(--spacer-sm);
    width: 900px;
  }

  h2 {
    display: block;
  }
}
</style>
