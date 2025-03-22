<template>
  <Modal klass="m-activation" :active="active" @onClose="onClose" :closeable="closeable">
    <h1>
      Activating your account
    </h1>
    <span v-if="!closeable" class="c-spinner"></span>
    <p v-if="activated">
      Your account has been activated!<br /> You can login to Operational and start your onboarding process.
    </p>
    <p v-if="error">
      Your account has either been previously activated<br /> or an invalid code was used to open this link.
    </p>
    <button v-if="closeable" class="btn" type="button" @click="onClose">
      Close
    </button>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";

import { workspaceApi } from "@/store/workspace.js"

export default {
  components: {
    Modal,
    Docs,
  },

  data: function () {
    return {
      code : '',
      closeable : false,
      activated : false,
      error : false
    };
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  watch : {
    active : function() {
      this.activate();
    }
  },

  methods : {
    onClose : function() {
      this.$emit('onClose');
    },
    checkActivationCode : function() {
      let route = this.$route;
if (!route.query) {
        return;
      }

      if (!route.query.code) {
        return;
      }

      let code = route.query.code;

      this.code = code;
    },
    async activate() {
      let form = {
        code : this.code
      }

      let res = null;

      try {

       res = await workspaceApi.activate(form)
       this.activated = true;
       this.closeable = true;

      }catch(err) {
        this.error = true;
        this.closeable = true;
        console.log(err);
      }
    }
  },

  mounted : function() {
    setTimeout(() => {
    this.checkActivationCode();
  }, 50);
  }
};
</script>

<style lang="scss">
.m-activation {
  .vfm__content {
    padding: var(--spacer-sm);
    text-align:center;
  }

  h3 {
    user-select:none;
    width: calc(100% - var(--spacer-lg));
  }
}
</style>
