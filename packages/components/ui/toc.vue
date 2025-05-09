<template>
  <div :class="['c-toc', { active: active === true }]">
    <header @click="active = !active">
      <h3>Contents</h3>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 9L12.7071 16.2929C12.3166 16.6834 11.6834 16.6834 11.2929 16.2929L4 9"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </header>
    <main>
      <div class="spacer"></div>
      <component
        :is="resolveComponent(heading)"
        v-for="(heading, i) in computedHeadings"
        :key="i"
        :href="`${heading.slug}`"
        :class="[
          'c-toc__item',
          { d1: heading.depth && heading.depth === 1 },
          { active: heading.slug && heading.slug === pathname }
        ]"
      >
        {{ heading.text }}
      </component>
    </main>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      active: false
    };
  },

  props: {
    headings: {},
    pathname: {}
  },

  computed: {
    computedHeadings: function () {
      let headings = this.headings;

      if (!headings) {
        return [];
      }

      // for (let i = 0; i < headings.length; i++) {
      //   let h = headings[i];
      //   console.log(h);
      // }

      return headings;
    }
  },

  methods: {
    resolveComponent: function (heading) {
      if (heading.slug) {
        return "a";
      }
      return "span";
    }
  }
};
</script>

<style lang="scss">
.c-toc {
  position: sticky;
  top: var(--spacer);

  &__item {
    position: relative;
    display: block;
    padding: var(--margin-sm) var(--margin-lg);
    color: var(--color-font);
    font-weight: 500;
    font-size: var(--font-size-sm);
    border-radius: var(--border-radius);
    transition: all var(--transition-time-sm) ease;

    &.d1 {
      padding-left: var(--spacer);
      margin-bottom: 0.1rem;
    }

    &.active {
      background-color: var(--color-bg-4);

      box-shadow:
        inset 0 -1px 1px 0 rgba(0, 0, 0, 0.005),
        inset 0 1px 1px 0 rgba(255, 255, 255, 0.02),
        inset 0 5px 20px 1px rgba(255, 255, 255, 0.02),
        0px 2px 5px 0px rgba(60, 66, 87, 0.04),
        0px 1px 1px 0px rgba(0, 0, 0, 0.06),
        0 0 0 1px rgba(0, 0, 0, 0.075);
    }

    &:focus {
      background-color: var(--color-bg-4);
      outline: none;
    }
  }

  a {
    &:hover,
    &:active {
      background-color: var(--color-bg-4);
    }
  }

  span {
    opacity: 0.7;
  }

  header {
    display: flex;
    align-items: center;
    user-select: none;
    padding-bottom: 0.5rem;

    svg {
      display: none;
    }

    h3 {
      margin-right: auto;
      margin-bottom: 0;
    }
  }

  main {
    overflow: hidden;
    transition: all var(--transition-time) ease;
  }

  @media screen and (max-width: 576px) {
    header {
      cursor: pointer;
      padding-bottom: 0;

      svg {
        display: block;
      }
    }

    .spacer {
      padding: var(--margin) 0;
    }

    main {
      height: 0;
    }

    &.active {
      main {
        height: auto;
      }
    }
  }
}
</style>
