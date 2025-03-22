<template>
  <div :class="['c-page-header', size]">
    <Constrain>
      <div class="c-page-header__inner">
        <section>
          <Subtitle v-if="subtitle" :subtitle="subtitle"> </Subtitle>
          <div v-if="subtitle" class="c-page-header__spacer"></div>
          <slot> </slot>
          <slot name="title">
            <h1>Build what customers actually want</h1>
          </slot>
          <div v-if="$slots.body" class="c-page-header__spacer"></div>

          <slot name="body"> </slot>
          <div v-if="image" class="c-page-header__spacer"></div>
        </section>
        <img v-if="image" :src="image" />
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
      default: ""
    },
    heading: {
      type: String,
      default: "h2"
    },
    size: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    }
  },

  computed: {}
};
</script>

<style lang="scss">
.c-page-header {
  padding: 4rem 0;
  padding-bottom: 2rem;
  text-align: center;

  &__inner {
    h1,
    h2 {
      margin-bottom: 0;
    }
  }

  &.sm {
    padding: 2rem 0;
    text-align: left;

    section {
      width: 80%;
    }
  }

  &__spacer {
    padding: 0.5rem;
  }

  @media screen and (max-width: 576px) {
    &.sm {
      section {
        width: 100%;
      }
    }
  }

  @media screen and (max-width: 576px) {
    padding: 3rem 0;

    &.sm {
      padding: 1.25rem 0;
    }
  }
}
</style>
