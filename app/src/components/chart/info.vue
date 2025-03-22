<template>
  <div class="c-chart-info">
    <article>
      <!-- <h3>{{ title }}</h3> -->
      <!-- <small>26th March 2024 — 25th April 2024</small> -->
    </article>
    <div class="c-chart-info__buttons">
      <!-- <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 6V15M12 15L15.5 12M12 15L8.5 12M8.25 18H15.75M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23Z"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: "",
    },
  },

  methods: {},
};
</script>

<style lang="scss">
.c-chart-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-sm);

  h3 {
    margin-bottom: 0;
  }

  &__buttons {
  }
}
</style>
