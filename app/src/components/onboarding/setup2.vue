<template>
  <div class="c-onboarding-setup2">
    <Constrain size="sm">
      <article>
        <h3>You've been onboarded!</h3>
        <p>Couple of things..</p>
        <ul>
          <li>
            The Playground inside the webapp has your api key and baseUrl loaded. All examples will
            work out of the box.
          </li>
          <li>
            Ran into snags? /Settings/Server has all the stuff you need to debug your self-hosted
            instance.
          </li>
        </ul>
        <button class="btn btn-primary" @click="$emit('onNext')">Let's go!</button>
      </article>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Copy from "@operational.co/components/ui/copy.vue";
export default {
  components: {
    Constrain,
    Copy,
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
.c-onboarding-setup2 {
}
</style>
