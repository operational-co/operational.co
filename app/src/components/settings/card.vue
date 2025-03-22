<template>
  <div class="c-settings-card">
    <div class="c-settings-card__inner">
      <header>
        <span v-if="paymentMethod.card">
          {{ paymentMethod.card.display_brand }}
        </span>
      </header>
      <main>
        <span v-if="paymentMethod.card"
          >xxxx-xxxx-xxxx-{{ paymentMethod.card.last4 }}</span
        >
      </main>
      <footer>
        <span v-if="paymentMethod.billing_details">
          {{ paymentMethod.billing_details.name }}
        </span>
      </footer>
    </div>
    <!--  <div class="c-settings-card__actions">
      <slot></slot>
    </div> -->
  </div>
</template>

<script>
export default {
  computed: {},

  props: {
    paymentMethod: {},
  },
};
</script>

<style lang="scss">
.c-settings-card {
  margin-bottom: 1.5rem;
  &__inner {
    width: 100%;
    background-image: linear-gradient(
      170deg,
      hsl(310deg 54% 33%) 0%,
      hsl(290deg 44% 29%) 29%,
      hsl(267deg 40% 27%) 43%,
      hsl(243deg 36% 22%) 57%,
      hsl(223deg 52% 15%) 71%,
      hsl(214deg 67% 8%) 100%
    );

    border-radius: 18px;

    display: grid;
    grid-template-columns: min-content max-content 1fr;
    grid-column-gap: var(--margin);
    align-items: center;
    padding: var(--spacer-sm);
  }

  &__actions {
    margin-top: 0.5rem;
  }

  header {
    span {
      display: inline-block;
      padding: var(--margin) var(--margin-lg);
      font-size: var(--font-size-sm);
      border-radius: var(--border-radius);
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  main {
    display: flex;
    align-items: center;

    font-family: var(--font-family-monospace);
    font-weight: 500;
    font-size: var(--font-size-lg);

    color: #e4e4e4;

    background: linear-gradient(to bottom, #ffffff 50%, #e4e4e4 51%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 2px 1px rgba(35, 8, 22, 0.2));
  }
}
</style>
