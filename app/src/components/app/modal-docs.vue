<template>
  <Modal klass="modal-docs" type="full-edge" :active="active">
    <Docs></Docs>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";

export default {
  components: {
    Modal,
    Docs,
  },

  data: function () {
    return {};
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.modal-docs {
  // article {
  //   text-align: center;
  // }

  // .c-constrain {
  //   height: 100%;

  //   &__inner {
  //     display: flex;
  //     flex-direction: column;
  //     align-items: center;
  //     justify-content: center;
  //   }
  // }
}
</style>
