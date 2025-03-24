<template>
  <div class="p-settings">
    <Settings></Settings>
  </div>
</template>

<script>
import Settings from "@/components/settings/index.vue";
export default {
  components: {
    Settings,
  },

  beforeRouteEnter: async function (to, from, next) {
    next((vm) => {
      //vm.$store.activity.refresh();
    });
  },
};
</script>

<style lang="scss">
.p-settings {
}
</style>
