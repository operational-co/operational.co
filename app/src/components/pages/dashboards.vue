<template>
  <div class="p-dashboards">
    <Dashboards></Dashboards>
  </div>
</template>

<script>
import Dashboards from "@/components/dashboards/index.vue";
export default {
  components: {
    Dashboards,
  },

  beforeRouteEnter: async function (to, from, next) {
    next((vm) => {
      // vm.$store.app.setLoading(true);
      // vm.$store.reports.refresh().then(() => {
      //   vm.$store.app.setLoading(false);
      // });
    });
  },
};
</script>

<style lang="scss"></style>
