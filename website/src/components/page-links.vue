<template>
  <div class="c-page-header">
    <Constrain>
      <div class="c-page-header__inner">
        <Subtitle v-if="subtitle" :subtitle="subtitle"> </Subtitle>
        <slot> </slot>
        <slot name="title">
          <h1>Build what customers actually want</h1>
        </slot>
        <article class="article-text">
          <slot name="body">
            <p>
              Capture feedback, understand user needs,<br />
              and prioritize product work that matters.
            </p>
          </slot>
        </article>
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
.c-page-header {
  &__inner {
    padding: 4rem 0;
    text-align: center;
  }
}
</style>
