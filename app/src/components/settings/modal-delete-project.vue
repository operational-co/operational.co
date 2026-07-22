<template>
  <Modal klass="m-delete-project" :active="active" :closeable="!processing" @onClose="onClose">
    <h3>Delete project</h3>
    <p v-if="workspace">Are you sure you want to permanently delete {{ workspace.name }}?</p>
    <p>All project data will be removed. This action cannot be undone.</p>

    <div class="m-delete-project__actions">
      <button class="btn" type="button" :disabled="processing" @click="onClose">Cancel</button>
      <button
        class="btn btn-danger"
        type="button"
        :disabled="processing || !canDelete"
        @click="onDeleteProject"
      >
        <span v-if="processing" class="c-spinner"></span>
        <span>Yes, delete project</span>
      </button>
    </div>

    <p v-if="error" class="m-delete-project__error">{{ error }}</p>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";

export default {
  components: {
    Modal,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
  },

  data: function () {
    return {
      processing: false,
      error: "",
    };
  },

  computed: {
    workspace: function () {
      return this.$store.workspace.resource;
    },
  },

  watch: {
    active: function () {
      if (this.active) {
        this.error = "";
      }
    },
  },

  methods: {
    onClose: function () {
      if (this.processing) {
        return;
      }

      this.$emit("onClose");
    },
    onDeleteProject: async function () {
      if (!this.workspace || !this.canDelete || this.processing) {
        return;
      }

      this.processing = true;
      this.error = "";

      try {
        await this.$store.workspace.deleteProject(this.workspace.id);
        window.location.href = "/";
      } catch (err) {
        this.error = err.message || "Project could not be deleted";
        this.processing = false;
      }
    },
  },
};
</script>

<style lang="scss">
.m-delete-project {
  .vfm__content {
    width: 500px;
    max-width: calc(100vw - 1.5rem);
    padding: 1rem;
  }

  h3 {
    width: calc(100% - 3rem);
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  &__error {
    color: var(--color-danger);
    margin-top: 0.75rem;
  }
}
</style>
