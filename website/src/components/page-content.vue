<template>
  <div class="c-page-content">
    <Constrain :size="size">
      <div class="c-page-content__inner">
        <slot> </slot>
      </div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";

export default {
  components: {
    Constrain,
    Subtitle
  },

  props: {
    size: {
      default: ""
    },
    subtitle: {
      default: "Landing page"
    },
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
.c-page-content {
  &__inner {
    padding: 4rem 0;
  }
}
</style>
