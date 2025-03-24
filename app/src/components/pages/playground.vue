<template>
  <div class="p-playground">
    <Playground type="app" :apikey="apikey"></Playground>
  </div>
</template>

<script>
import Playground from "@operational.co/components/playground/index.vue";
export default {
  components: {
    Playground,
  },

  computed: {
    baseUrl: function () {
      return this.$store.app.baseUrl;
    },
    baseApiUrl: function () {
      return this.$store.app.baseApiUrl;
    },
    user: function () {
      return this.$store.user.resource;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    assetPath: function () {
      let baseUrl = "http://localhost:2000";

      if (import.meta && import.meta.env.VITE_API_URL) {
        baseUrl = import.meta.env.VITE_API_URL;
      }
      return `${baseUrl}/uploads`;
    },
    apikeys: function () {
      if (!this.workspace) {
        return [];
      }

      if (!this.workspace.keys) {
        return [];
      }

      return this.workspace.keys;
    },
    apikey: function () {
      if (this.apikeys) {
        return this.apikeys[0].key;
      }
    },
  },
};
</script>

<style lang="scss">
.p-playground {
}
</style>
