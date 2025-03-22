<template>
  <Modal klass="modal-profile-user" @onClose="active = false" :active="active">
    <article>
      <h2>Manage user</h2>
      <p>lolwa</p>
    </article>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";

export default {
  components: {
    Modal,
  },

  data: function () {
    return {};
  },

  props: {
    active: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss">
.modal-profile-user {
  article {
    padding: 16px;
  }
}
</style>
