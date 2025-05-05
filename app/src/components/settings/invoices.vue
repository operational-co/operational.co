<template>
  <div class="c-profile-invoices">
    <section>
      <h4>Invoices <span class="c-spinner" v-if="processing"></span></h4>
      <p>View or download your past invoices.</p>

      <div class="c-profile-invoices__header">
        <span>Invoice code</span>
        <span> Period start</span>
        <span> Period end</span>
        <span> Status </span>
        <span> Amount </span>
        <div></div>
      </div>

      <div class="c-profile-invoices__item" v-for="invoice in invoices" :key="invoice.id">
        <span>{{ invoice.code }}</span>
        <span> {{ formatDate(invoice.periodStart) }} </span>
        <span> {{ formatDate(invoice.periodEnd) }} </span>
        <span>{{ invoice.status }}</span>
        <span> ${{ invoice.total }} </span>
        <div>
          <button type="button" class="btn btn-sm" @click="onDownload(invoice)">Download</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data: function () {
    return {
      processing: false,
    };
  },

  computed: {
    invoices: function () {
      return this.$store.invoices.resources;
    },
  },

  methods: {
    async getInvoices() {
      const invoices = await this.$store.invoices.load();
    },
    formatDate: function (date) {
      return moment(date).format("Do MMM, YYYY");
    },
    async onDownload(invoice) {
      if (this.processing) {
        return;
      }
      this.processing = true;
      await this.$store.invoices.download(invoice);
      this.processing = false;
    },
  },

  mounted: function () {
    this.getInvoices();
  },
};
</script>

<style lang="scss">
.c-profile-invoices {
  h4 {
    .c-spinner {
      margin-left: var(--margin);
    }
  }

  &__header {
    padding: var(--margin) 0;
    display: grid;
    grid-template-columns: 100px 140px 140px 100px 1fr 1fr;
    align-items: center;

    border-bottom: var(--color-bg-5) solid 1px;

    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  &__item {
    padding: var(--margin) 0;
    display: grid;
    grid-template-columns: 100px 140px 140px 100px 1fr 1fr;
    align-items: center;

    border-top: var(--color-bg-5) solid 1px;

    &:not(:last-of-type) {
      border-bottom: var(--color-bg-5) solid 1px;
    }

    > div {
      margin-left: auto;
    }
  }

  @media screen and (max-width: 576px) {
    &__header {
      grid-template-columns: 80px 80px 60px 60px 1fr;
    }
    &__item {
      grid-template-columns: 80px 80px 60px 60px 1fr;

      font-size: var(--font-size-sm);
    }
  }
}
</style>
