<template>
  <div class="c-docs-sidebar">
    <h2>Docs</h2>
    <nav>
      <router-link to="/">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 6H19M7 3H17M5 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V19C3 20.1046 3.89543 21 5 21Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>

        <span> Manual </span>
      </router-link>
      <a href="https://operational.co/manual">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.5 22H6C4.89543 22 4 21.1046 4 20M18.5 22H20M18.5 22C18.5 22 19 21.5 19 20C19 18.5 18.5 18 18.5 18M18.5 18H6C4.89543 18 4 18.8954 4 20M18.5 18C19.3284 18 20 17.3284 20 16.5V5C20 3.34315 18.6569 2 17 2H6C4.89543 2 4 2.89543 4 4V20"
            stroke="currentColor"
            stroke-linecap="round"
          />
        </svg>
        <span> API </span>
      </a>
    </nav>
  </div>
</template>

<script>
export default {
  components: {},

  computed: {
    user: function () {
      return this.$store.user.resource;
    },
  },
};
</script>

<style lang="scss">
.c-docs-sidebar {
  nav {
    padding-top: 12px;
    a {
      display: grid;
      grid-template-columns: 24px 1fr;
      align-items: center;
      padding: 4px;
      font-size: var(--font-size-lg);
      color: var(--color-font);
      border-radius: var(--input-radius);
      transition: all 60ms linear;

      > span {
        padding-left: var(--margin);
      }

      &:hover,
      &:active,
      &:focus {
        background-color: var(--color-bg-4);
      }

      &.router-link-active {
        color: var(--color-primary);
      }

      svg {
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
}
</style>
