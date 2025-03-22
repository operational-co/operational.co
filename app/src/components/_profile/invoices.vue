<template>
  <div class="c-profile-invoices">
    <h3>Invoices</h3>
    <p>View or download your past invoices.</p>

    <div class="c-profile-invoices__header">
      <span>Invoice code</span>
      <span> Date</span>
      <span> Status </span>
      <span> Amount </span>
      <div></div>
    </div>

    <div class="c-profile-invoices__item">
      <span>INV-007</span>
      <span> May 2024 </span>
      <span> Paid </span>
      <span> $1.3 </span>
      <div>
        <button type="button" class="btn btn-sm">Download</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
};
</script>

<style lang="scss">
.c-profile-invoices {
  &__header {
    padding: var(--margin) 0;
    display: grid;
    grid-template-columns: 100px 100px 100px 100px 1fr;
    align-items: center;

    border-bottom: var(--color-bg-5) solid 1px;

    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  &__item {
    padding: var(--margin) 0;
    display: grid;
    grid-template-columns: 100px 100px 100px 100px 1fr;
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
