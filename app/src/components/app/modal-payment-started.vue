<template>
  <Modal
    klass="m-payment-started"
    :active="active"
    @onClose="onClose"
    :closeable="closeable"
  >
    <h2>Your payment details have been collected</h2>
    <p>
      Operational will charge your card at the end of every month from now on.
    </p>
    <p>
      Should you have any questions, you can contact me at shash@operational.co
    </p>
    <button v-if="closeable" class="btn" type="button" @click="onClose">
      Close
    </button>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";

import { workspaceApi } from "@/store/workspace.js";

export default {
  components: {
    Modal,
    Docs,
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
        const { query, params, path, hash } = this.$route;
        console.log(query);
        const url = new URL(window.location.href); // Get the current URL
        url.searchParams.delete("confirm"); // Remove the query parameter

        // Update the URL without reloading the page
        window.history.replaceState({}, "", url);
      }
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
.m-payment-started {
  .vfm__content {
    padding: var(--spacer-sm);
  }

  h3 {
    user-select: none;
    width: calc(100% - var(--spacer-lg));
  }
}
</style>
