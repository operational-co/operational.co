<template>
  <div class="c-onboarding-support">
    <Constrain size="sm">
      <article>
        <h1>
          Support
        </h1>

        <p>
          Support is provided via a in-app chat widget.
        </p>

        <p>
          We usually resolve issues within a few hours. Our max resolution time is 2 business days(worst case scenario).
        </p>

        <p>
          You can also write to us for feature requests or feedback throught the chat widget or at shash@operational.co
        </p>
        <button class="btn btn-primary" @click="$emit('onNext')">Next</button>
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
    apikey: function () {
      return "ops_123123123";
    },
  },
};
</script>

<style></style>
