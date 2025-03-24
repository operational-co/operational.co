<template>
  <div class="c-ui-heading">
    <Constrain>
      <span class="c-ui-heading__subtitle" v-if="subtitle">
        {{ subtitle }}
      </span>
      <component class="fancy" :is="headingType">
        <slot></slot>
      </component>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";

export default {
  components: {
    Constrain
  },

  props: {
    subtitle: {},
    heading: {
      type: String,
      default: "h2"
    }
  },

  computed: {
    headingType: function () {
      return this.heading;
    }
  }
};
</script>

<style lang="scss">
.c-ui-heading {
  &__subtitle {
    padding: var(--spacer-sm) 0;
    display: block;
    text-align: center;
    font-weight: 600;
    text-align: center;
  }

  h2 {
    font-family: var(--font-family-heading);
    font-size: var(--font-size-xxxxl);
    line-height: 3.5rem;
    font-weight: 300;
    text-align: center;
  }
}
</style>
