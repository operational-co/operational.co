<template>
  <div class="c-sidebar">
    <h1 class="fancy">Operational</h1>
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

        <span> Events </span>
      </router-link>
      <router-link to="/profile">
        <Avatar :user="user"></Avatar>
        <span> {{ user.firstName }} {{ user.lastName }} </span>
      </router-link>
      <div class="c-sidebar__divider"></div>
      <a href="https://operational.co/api" target="_blank">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.92308 6H18M18 6V16.0769M18 6L6 18"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span> API docs </span>
      </a>
      <a href="https://operational.co/manual/introduction" target="_blank">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.92308 6H18M18 6V16.0769M18 6L6 18"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span> Manual </span>
      </a>
    </nav>
  </div>
</template>

<script>
import Avatar from "@operational.co/components/ui/avatar.vue";

export default {
  components: {
    Avatar,
  },

  computed: {
    user: function () {
      return this.$store.user.resource;
    },
  },
};
</script>

<style lang="scss">
.c-sidebar {
  position: absolute;
  top: 0;
  right: calc(50% + 354px + 30px);
  width: 240px;
  padding: var(--spacer-sm) 0;

  &__divider {
    margin: var(--margin);
    height: 2px;
    background-color: var(--color-bg-3);
  }

  h1 {
    //font-family: "PP Editorial New";
    font-weight: 500;
    font-stretch: italic;
    margin-bottom: 0;
    //padding: var(--margin-lg) 0;
  }

  nav {
    padding-top: 12px;
    a {
      display: grid;
      grid-template-columns: 16px 1fr;
      align-items: center;
      padding: 4px;
      font-size: var(--font-size);
      font-weight: 500;
      color: var(--color-font);
      border-radius: var(--input-radius);
      transition: all 60ms linear;

      > span {
        padding-left: var(--margin-sm);
      }

      &:hover,
      &:active,
      &:focus {
        background-color: var(--color-bg-4);
      }

      &.router-link-active {
        color: var(--color-link);
      }

      svg {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }

  @media screen and (max-width: 1300px) {
    width: 200px;
    right: calc(50% + 354px);
  }
  @media screen and (max-width: 940px) {
    display: none;
  }
}
</style>
