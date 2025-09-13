<template>
  <Modal type="full-edge" klass="m-widget-create" :active="active" @onClose="onClose">
    <Picker @onClose="onClose"></Picker>
  </Modal>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Modal from "@operational.co/components/ui/modal.vue";

import Picker from "@/components/picker/index.vue";

export default {
  components: {
    Constrain,
    Modal,
    Picker,
  },

  data: function () {
    return {
      currentTab: "login",
    };
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClose: function () {
      this.$emit("onClose");
    },
  },

  mounted: function () {},
};
</script>

<style lang="scss">
.m-widget-create {
  .vfm__content {
    padding: var(--spacer-sm);
  }

  h3 {
    width: calc(100% - var(--spacer-lg));
  }
}
</style>
