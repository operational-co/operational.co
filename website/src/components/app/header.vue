<template>
  <div :class="['c-header', { hidden: hidden === true }, { active: menuActive === true }]">
    <div class="c-header__inner">
      <Constrain>
        <a class="logo" href="/">
          <h1>Operational</h1>
        </a>
        <a data-astro-prefetch class="btn btn-transparent" href="/docs/start-here">Docs</a>
        <a
          class="btn btn-transparent"
          href="https://github.com/operational-co/operational.co"
          target="_blank"
          >Github</a
        >
        <a class="btn btn-sm btn-fancy" href="https://app.operational.co?login"> Open app </a>
      </Constrain>
    </div>

    <div class="c-header__mobile">
      <a class="logo" href="/">
        <h1>Operational</h1>
      </a>
      <button type="button">
        <svg
          @click.prevent="onMenuToggle"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2 7C2 6.44772 2.44772 6 3 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H3C2.44772 8 2 7.55228 2 7ZM2 17C2 16.4477 2.44772 16 3 16H21C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H3C2.44772 18 2 17.5523 2 17Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
    <div class="c-header__menu">
      <a href="https://github.com/operational-co/operational.co" target="_blank">Github</a>
      <a data-astro-prefetch :class="[{ active: route.includes('/articles') }]" href="/articles">
        Articles
      </a>
      <a data-astro-prefetch :class="[{ active: route.includes('/pitch') }]" href="/pitch">
        Pitch
      </a>
      <a data-astro-prefetch :class="[{ active: route.includes('/usecases') }]" href="/usecases">
        Usecases
      </a>
      <a
        data-astro-prefetch
        :class="[{ active: route.includes('/playground') }]"
        href="/playground"
      >
        Playground
      </a>
      <a
        data-astro-prefetch
        :class="[{ active: route.includes('/docs/start-here') }]"
        href="/docs/start-here"
      >
        API
      </a>
    </div>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";

export default {
  components: {
    Constrain,
  },

  data: function () {
    return {
      menuActive: false,
    };
  },

  props: {
    hidden: {},
    url: {},
  },

  computed: {
    route: function () {
      if (!this.url) {
        return "";
      } else {
      }

      return this.url.pathname;
    },
  },

  methods: {
    onMenuToggle: function () {
      this.menuActive = !this.menuActive;
    },
  },
};
</script>

<style lang="scss">
.c-header {
  position: relative;
  //position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(4px);

  .logo {
    position: relative;
    margin-right: auto;

    display: flex;
    align-items: center;

    h1 {
      display: inline-block;
      padding: var(--margin);
      font-size: var(--font-size-lg);
      margin: 0;
      color: var(--color-font);
      transition: all var(--transition-time) linear;

      &:hover,
      &:active {
        color: var(--color-primary-light);
      }
    }

    span {
      display: inline-block;
      padding: var(--margin);
      margin-left: var(--margin);
      font-size: var(--font-size-sm);
      font-weight: 500;
      font-family: var(--font-family-monospace);
      line-height: 1;
      color: var(--color-font-light);
      background-color: var(--color-bg-2);
      border-radius: var(--border-radius);
    }

    &:after {
      content: "Beta";
      display: inline-block;
      line-height: 1;
      font-family: var(--font-family-monospace);
      font-size: var(--font-size-sm);
      font-weight: 500;
      background-color: var(--color-bg-3);
      padding: var(--margin-sm) var(--margin);
      border-radius: var(--border-radius-sm);
      color: var(--color-font);
    }
  }

  &__inner {
    .c-constrain {
      &__inner {
        padding: var(--spacer-sm) 0;
        display: flex;
        align-items: center;
      }
    }

    .btn {
      margin-left: var(--margin-lg);
      &.btn-sm {
        padding: var(--margin) var(--margin-lg);
      }
    }
  }

  &.hidden {
  }

  &__mobile {
    display: none;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 48px;
    justify-content: space-between;

    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    border-bottom: solid 1px var(--color-translucent);

    button {
      -webkit-appearance: none;
      border: none;
      background-color: transparent;
      touch-action: manipulation;
      user-select: none;
      color: var(--color-font);
      padding: var(--margin-lg);
      cursor: pointer;
    }
  }

  &__menu {
    display: none;
    position: fixed;
    top: 48px;
    left: 0;
    width: 100%;
    align-items: center;

    pointer-events: none;
    opacity: 0;
    transform: translateY(-4px);
    transition: all var(--transition-time) var(--ease-out-quad);
    border-bottom: solid 1px var(--color-translucent);

    a {
      display: block;
      background-color: var(--color-bg-2);
      font-weight: 500;
      padding: var(--margin-lg);
      touch-action: manipulation;

      &:hover,
      &:active {
        background-color: var(--color-bg-4);
      }
    }
  }

  &.active {
    .c-header__mobile {
      background-color: var(--color-bg-2);
      border-color: var(--color-bg-2);
    }
    .c-header__menu {
      pointer-events: initial;
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media screen and (max-width: 576px) {
    height: auto;

    &__inner {
      display: none;
    }
    &__mobile {
      display: flex;
    }
    &__menu {
      display: block;
    }
  }
}
</style>
