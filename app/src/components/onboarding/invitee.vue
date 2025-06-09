<template>
  <div class="c-onboarding-invitee">
    <Constrain size="sm">
      <article>
        <h3>Welcome!</h3>
        <p>👋 Hi {{ user.firstName }}, welcome to Operational!</p>

        <button class="btn btn-primary" @click="$emit('onNext')">Let's go!</button>
      </article>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
export default {
  components: {
    Constrain,
  },

  computed: {
    user: function () {
      return this.$store.user.resource;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
  },
};
</script>

<style lang="scss">
.c-onboarding-invitee {
  .c-constrain__inner {
    text-align: center;
  }
}
</style>
