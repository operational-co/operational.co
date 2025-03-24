<template>
  <div class="p-crm">
    <Crm></Crm>
  </div>
</template>

<script>
import Crm from "@/components/crm/index.vue";
export default {
  components: {
    Crm,
  },

  beforeRouteEnter: async function (to, from, next) {
    next((vm) => {
      vm.$store.app.setLoading(true);
      vm.$store.crm.refresh().then(() => {
        vm.$store.app.setLoading(false);
      });
    });
  },
};
</script>

<style lang="scss"></style>
