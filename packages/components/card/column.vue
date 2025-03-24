<template>
  <div :class="['card-column', `gap-${gapSize}`, `card-column__${variant}`]">
    <template v-if="content">
      <div class="card-column__item" v-for="(data, i) in content" key="i">
        <Resolve :payload="data"></Resolve>
      </div>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import Resolve from "./resolve.vue";

export default {
  components: {
    Resolve,
  },

  props: {
    payload: {},
  },

  computed: {
    content: function () {
      let content = this.payload.content || [];

      return content;
    },
    variant: function () {
      return "timeline";
    },
    gapSize: function () {
      return "m";
    },
  },
};
</script>

<style lang="scss">
.card-column {
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
  padding: 2px 0;

  &__item {
  }
}
</style>
