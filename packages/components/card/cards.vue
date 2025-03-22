<template>
  <div class="card-cards">
    <template v-for="(card, i) in computedPayload" :key="i">
      <Resolve :payload="card"></Resolve>
    </template>
  </div>
</template>

<script>
import moment from "moment";

import { defineAsyncComponent } from "vue";

export default {
  components: {
    Resolve: defineAsyncComponent(() => Promise.resolve(import("./resolve.vue")))
  },

  props: {
    payload: {}
  },

  computed: {
    computedPayload: function () {
      let payload = null;
      try {
        payload = JSON.parse(this.payload.content);
      } catch (err) {}

      return payload;
    },
    label: function () {
      return this.payload.label || null;
    },
    text: function () {
      let text = this.payload.content;

      return text || "";
    },
    variant: function () {
      return this.payload.variant || "";
    }
  }
};
</script>

<style lang="scss">
.card-cards {
  > div {
    &:not(:last-child) {
      margin-bottom: var(--margin);
    }
  }
}
</style>
