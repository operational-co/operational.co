<template>
  <div class="c-onboarding-apikey">
    <Constrain size="sm">
      <article>
        <p>Operational can send events on your device. Get notified when something happens.</p>
        <p>Do you want to enable push notifications for your events on this device?</p>

        <button class="btn btn-primary" @click="$emit('onNext')">Yes</button>
        <button class="btn" @click="$emit('onNext')">Skip</button>
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
