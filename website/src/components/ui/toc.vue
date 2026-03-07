<template>
  <div :class="['c-toc', { active: active === true }]">
    <header @click="active = !active">
      <h3>Contents</h3>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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
        :is="resolveComponent(item, null, null)"
        :key="i"
        :href="getHref(item, null, null)"
        :class="[
          'c-toc__item',
          {
            expandable: !!item.children,
            expanded: isExpanded(getExpandKey(item, null)),
            active: isActive(item, null, null),
          },
        ]"
      >
        <template v-if="item.children">
          <span @click.stop="toggleExpand(item, null)">
            {{ item.name }}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
              v-for="(subItem, j) in item.children"
              :is="resolveComponent(subItem, item, null)"
              :key="`${j}-${subItem.name}`"
              :href="getHref(subItem, item, null)"
              :class="[
                'c-toc__item',
                {
                  active: isActive(subItem, item, null),
                  expandable: !!subItem.children,
                  expanded: isExpanded(getExpandKey(subItem, item)),
                },
              ]"
            >
              <template v-if="subItem.children">
                <span @click.stop="toggleExpand(subItem, item)" class="c-toc__group-title">
                  {{ subItem.name }}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                    v-for="(thirdItem, k) in subItem.children"
                    :is="resolveComponent(thirdItem, item, subItem)"
                    :key="`${k}-${thirdItem.name}`"
                    :href="getHref(thirdItem, item, subItem)"
                    :class="['c-toc__item', { active: isActive(thirdItem, item, subItem) }]"
                  >
                    <template v-if="thirdItem.method">
                      <em class="c-toc__method">{{ thirdItem.method }}</em>
                      {{ " " }}
                    </template>
                    {{ thirdItem.name }}
                  </component>
                </div>
              </template>
              <template v-else>
                <template v-if="subItem.method">
                  <em class="c-toc__method">{{ subItem.method }}</em>
                  {{ " " }}
                </template>
                {{ subItem.name }}
              </template>
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
import { list } from "@/content/list.js";

export default {
  data: function () {
    return {
      active: false,
      expands: [],
    };
  },

  props: {
    pathname: {},
    items: {
      default: null,
    },
  },

  computed: {
    computedList: function () {
      if (Array.isArray(this.items) && this.items.length > 0) {
        return this.items;
      }
      return list;
    },
  },

  methods: {
    getHref: function (item, parentItem) {
      if (item.path) {
        return item.path;
      }
      if (item.baseSlug) {
        return `/${item.baseSlug}/${item.slug}`;
      }
      if (parentItem && parentItem.slug && item.slug) {
        return `/${parentItem.slug}/${item.slug}`;
      }
      if (item.slug) {
        return `/${item.slug}`;
      }
      return null;
    },
    getExpandKey: function (item, parentItem) {
      const itemKey = item.slug || item.name;
      if (parentItem) {
        return `${parentItem.slug || parentItem.name}/${itemKey}`;
      }
      return itemKey;
    },
    isExpanded: function (key) {
      return this.expands.includes(key);
    },
    addExpand: function (key) {
      if (!this.expands.includes(key)) {
        this.expands.push(key);
      }
    },
    toggleExpand: function (item, parentItem) {
      const key = this.getExpandKey(item, parentItem);
      if (!this.expands.includes(key)) {
        this.expands.push(key);
      } else {
        this.expands = this.expands.filter((expand) => {
          if (expand === key) {
            return false;
          }
          return true;
        });
      }
    },
    isActive: function (item, parentItem) {
      const href = this.getHref(item, parentItem);
      if (!href) {
        return false;
      }
      return this.pathname === href;
    },
    resolveComponent: function (item, parentItem) {
      if (item.children) {
        return "div";
      }
      const href = this.getHref(item, parentItem);
      if (href) {
        return "a";
      }
      return "span";
    },
  },

  mounted: function () {
    const pathname = this.pathname;

    for (let i = 0; i < this.computedList.length; i++) {
      const item = this.computedList[i];

      if (!item.children) {
        continue;
      }

      const topKey = this.getExpandKey(item, null);

      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j];

        if (child.children) {
          const childKey = this.getExpandKey(child, item);
          for (let k = 0; k < child.children.length; k++) {
            const grandChild = child.children[k];
            const grandChildPath = this.getHref(grandChild, item);
            if (grandChildPath === pathname) {
              this.addExpand(topKey);
              this.addExpand(childKey);
              break;
            }
          }
        } else {
          const childPath = this.getHref(child, item);
          if (childPath === pathname) {
            this.addExpand(topKey);
            break;
          }
        }
      }
    }
  },
};
</script>

<style lang="scss">
.c-toc {
  position: sticky;
  top: 2rem;

  &__item {
    position: relative;
    display: block;
    margin: 0.125rem 0;
    padding: 0.25rem 0.75rem;
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
      padding-right: 0;

      span {
        &:hover {
          opacity: 1;
        }
      }

      &.expanded {
        span {
          opacity: 1;
        }

        > .c-toc__item__subitems {
          height: 100%;
        }

        > span {
          > svg {
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

  .c-toc__group-title {
    font-weight: 600;
  }

  .c-toc__method {
    display: inline-block;
    padding: 0.125rem 0.25rem;
    font-style: normal;
    font-family: var(--font-family-monospace);
    font-size: var(--font-size-xs);
    font-weight: 600;
    line-height: 1;
    border-radius: 0.25rem;
    background-color: hsla(var(--hue-blue), 94%, 48%, 40%);
    color: hsl(var(--hue-blue), 94%, 75%);
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
      padding: 0.375rem 0;
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
