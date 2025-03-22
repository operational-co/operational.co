<template>
  <div class="c-heading">
    <Constrain>
      <span v-if="byline" class="byline">{{ byline }}</span>
      <h1 class="h2">{{ title }}</h1>
      <article class="article-text"><slot></slot></article>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
export default {
  components: {
    Constrain,
  },

  props: {
    byline: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.c-heading {
  h1 {
    margin-bottom: 8px;
  }
}
</style>
