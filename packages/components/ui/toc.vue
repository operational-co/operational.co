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
        v-for="(item, i) in computedList"
        :is="resolveComponent(item)"
        :key="i"
        :href="getHref(item)"
        :class="[
          'c-toc__item',
          {
            expandable: !!item.children,
            expanded: expands.includes(item.slug)
          }
        ]"
      >
        <template v-if="item.children">
          <span @click="toggleExpand(item)">
            {{ item.name }}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 10L11.4697 13.4697C11.7626 13.7626 12.2374 13.7626 12.5303 13.4697L16 10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <div class="c-toc__item__subitems">
            <component
              v-for="(subItem, i) in item.children"
              :is="resolveComponent(subItem)"
              :key="i"
              :href="`/${item.slug}/${subItem.slug}`"
              :class="['c-toc__item', { active: item.slug && pathname === `/${item.slug}/${subItem.slug}` }]"
            >
              {{ subItem.name }}
            </component>
          </div>
        </template>
        <template v-else>
          {{ item.name }}
        </template>
      </component>
    </main>
  </div>
</template>

<script>
import { list, getItems } from "@/content/list.js";
export default {
  data: function () {
    return {
      active: false,
      expands: []
    };
  },

  props: {
    pathname: {}
  },

  computed: {
    computedList: function () {
      return list;
    }
  },

  methods: {
    getHref: function (item) {
      if (item.baseSlug) {
        return `/${item.baseSlug}/${item.slug}`;
      } else {
        return `/${item.slug}`;
      }
    },
    toggleExpand: function (item) {
      if (!this.expands.includes(item.slug)) {
        this.expands.push(item.slug);
      } else {
        this.expands = this.expands.filter((expand) => {
          if (expand === item.slug) {
            return false;
          }
          return true;
        });
      }
    },
    resolveComponent: function (item) {
      if (item.children) {
        return "div";
      }
      if (item.slug) {
        return "a";
      }
      return "span";
    }
  },

  mounted: function () {
    let pathname = this.pathname;

    for (let i = 0; i < list.length; i++) {
      let item = list[i];

      if (item.children) {
        for (let j = 0; j < item.children.length; j++) {
          let child = item.children[j];

          let path = `/${item.slug}/${child.slug}`;
          if (path === pathname) {
            this.expands.push(item.slug);
            break;
          }
        }
      }
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

    &__subitems {
      padding-left: 0.5rem;
      height: 0;
      overflow: hidden;
      transition: height var(--transition-time) linear;
    }

    &.expandable {
      cursor: pointer;
      margin-top: 0.25rem;

      span {
        &:hover {
          opacity: 1;
        }
      }

      &.expanded {
        span {
          opacity: 1;
        }

        .c-toc__item__subitems {
          height: 100%;
        }

        span {
          svg {
            transform: rotate(180deg);
          }
        }
      }
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
    display: flex;
    opacity: 0.7;
    user-select: none;

    svg {
      display: inline-block;
      margin-left: auto;
    }
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
