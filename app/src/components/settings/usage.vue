<template>
  <div class="c-settings-usage">
    <section class="c-settings-section">
      <!-- <h5>Usage for this month</h5>
			<UsageItem /> -->

      <article v-if="!isSelfHosted" class="c-settings-usage__free">
        <strong> Free events usage </strong>
        <span></span>
      </article>

      <template v-if="metrics.length > 0">
        <MetricItem
          v-for="(metric, i) in computedMetrics"
          :key="metric.id"
          :metric="metric"
        ></MetricItem>
      </template>
      <template v-else>
        <div class="c-settings-usage__empty">
          <span> No metrics found. </span>
        </div>
      </template>

      <div v-if="processing" class="c-settings-usage__processing">
        <span class="c-spinner"> </span>
      </div>
    </section>
  </div>
</template>

<script>
import UsageItem from "./usage-item.vue";
import MetricItem from "./metric-item.vue";
import moment from "moment";

export default {
  components: {
    UsageItem,
    MetricItem,
  },

  data: function () {
    return {
      processing: true,
    };
  },

  computed: {
    computedMetrics: function () {
      let metrics = this.metrics;

      const sortedData = metrics.sort((a, b) => {
        const dateA = moment()
          .year(a.year)
          .month(a.month - 1);
        const dateB = moment()
          .year(b.year)
          .month(b.month - 1);

        return dateB.isBefore(dateA) ? 1 : -1;
      });

      return sortedData;
    },
    metrics: function () {
      return this.$store.metric.resources || [];
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    users: function () {
      if (!this.workspace) {
        return [];
      }

      return this.workspace.users || [];
    },
    isSelfHosted: function () {
      return this.$store.app.isSelfHosted;
    },
  },

  methods: {
    load: async function () {
      this.processing = true;

      await this.$store.metric.load();

      this.processing = false;
    },
  },

  mounted: function () {
    this.load();
  },
};
</script>

<style lang="scss">
.c-settings-usage {
  .c-metric-item {
    margin-bottom: 0.5rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__free {
    padding-bottom: 1rem;

    span {
      position: relative;
      display: block;
      margin-top: 0.5rem;
      width: 100%;
      height: 8px;
      border-radius: 99px;
      background-color: var(--color-bg-5);
      overflow: hidden;

      &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        border-radius: 99px;
        background-color: var(--color-primary);
      }
    }
  }

  &__processing {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
}
</style>
