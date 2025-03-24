<template>
  <div class="p-index">
    <Events></Events>
  </div>
</template>

<script>
import Events from "@/components/events/index.vue";
export default {
  components: {
    Events,
  },

  beforeRouteEnter: async function (to, from, next) {
    next((vm) => {});
  },
};
</script>

<style lang="scss"></style>
