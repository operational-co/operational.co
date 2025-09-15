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
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: hsl(var(--hue-p), 6%, 18%);
      border-radius: 0;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--hue-p), 6%, 18%);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  h2 {
    display: block;
  }

  @media screen and (max-width: 576px) {
    padding: 0;
    .vfm__content {
      width: 100%;
      border-radius: 0;
    }
  }
}
</style>
