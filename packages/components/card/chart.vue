<template>
  <div class="c-card-chart">
    <h5>Chart</h5>
    <Chart></Chart>
  </div>
</template>

<script>
import Chart from "@/components/chart/index.vue";

export default {
  components: {
    Chart,
  },
};
</script>

<style lang="scss">
.c-card-chart {
  min-height: 120px;
}
</style>
