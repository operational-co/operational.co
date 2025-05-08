<template>
  <div class="c-onboarding-apikey">
    <Constrain size="sm">
      <article>
        <p>👋 Welcome to Operational, {{ user.firstName }}</p>
        <p>Here's your API key.</p>
        <Code>
          <pre>{{ apikey }}</pre>
        </Code>
        <p>Copy this key and save it somewhere secure.</p>

        <button class="btn btn-primary" @click="$emit('onNext')">Next</button>
      </article>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Copy from "@operational.co/components/ui/copy.vue";
import Code from "@operational.co/components/code/index.vue";

export default {
  components: {
    Constrain,
    Copy,
    Code,
  },

  computed: {
    user: function () {
      return this.$store.user.resource;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    apikey: function () {
      let workspace = this.workspace;
      if (!workspace) {
        return "";
      }

      let apikeys = workspace.keys;
      if (!apikeys) {
        return "";
      }
      let key = apikeys[0].key;
      return key;
    },
  },
};
</script>

<style lang="scss">
.c-onboarding-setup {
}
</style>
