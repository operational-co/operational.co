<template>
  <div class="c-onboarding-outro">
    <Constrain size="sm">
      <article>
        <p>
        	You've been onboarded!
        </p>

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
};
</script>

<style lang="scss">
  .c-onboarding-outro {
    .c-constrain__inner {
      text-align:center;
    }
  }
</style>
