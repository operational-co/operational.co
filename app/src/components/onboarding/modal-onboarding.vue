<template>
  <Modal klass="m-onboarding" :active="active" :closeable="false">
    <Onboarding></Onboarding>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Onboarding from "./index.vue";

export default {
  components: {
    Modal,
    Onboarding,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    user: function () {
      return this.$store.user.resource;
    },
  },

  mounted: function () {
    // resolve currentTab here
  },
};
</script>

<style lang="scss">
.m-onboarding {
  .vfm__content {
    border-radius: 24px;
  }
}
</style>
