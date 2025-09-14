<template>
  <div class="c-events-sidebar">
    <main>
      <strong>Categories</strong>
      <section
        :class="[{ active: currentCategory && cat.text === currentCategory }]"
        v-for="(cat, i) in computedCategories"
        :key="i"
      >
        <article v-if="cat.type === 'separator'">
          <span>
            {{ cat.text }}
          </span>
          <section
            :class="[{ active: currentCategory && cat.text === currentCategory }]"
            v-for="(cat, i) in cat.categories"
            :key="i"
          >
            <a
              :class="[{ active: currentCategory && cat.text === currentCategory }]"
              href="#"
              @click.prevent="filterCategory(cat)"
            >
              {{ cat.text }}
            </a>
          </section>
        </article>
        <a
          v-else
          :class="[{ active: currentCategory && cat.text === currentCategory }]"
          href="#"
          @click.prevent="filterCategory(cat)"
        >
          {{ cat.text }}
        </a>
      </section>
    </main>
  </div>
</template>

<script>
import { toRaw } from "vue";

// Function to split the text and create the required structure
function transformArray(arr) {
  return arr;
}

export default {
  data: function () {
    return {
      category: null,
    };
  },

  computed: {
    currentCategory: function () {
      return this.$store.events.category;
    },
    computedCategories: function () {
      let categories = toRaw(this.categories);

      categories = this.uniqueById(categories);

      //console.log(categories);

      categories.push({
        id: 46,
        text: "cron.billing",
      });

      categories = transformArray(categories);

      return categories;
    },
    categories: function () {
      if (!this.workspace) {
        return [];
      }
      let categories = this.workspace.categories || [];
      return categories;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
  },

  methods: {
    uniqueById: function (arr) {
      const seen = new Set();
      return arr.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    },
    filterCategory: function (cat) {
      if (cat.text === this.currentCategory) {
        this.$emit("onCategorySelected", null);
      } else {
        this.$emit("onCategorySelected", cat.text);
      }
    },
  },
};
</script>

<style lang="scss">
.c-events-sidebar {
  margin-top: 0.5rem;
  padding-right: calc(var(--margin) * 2);

  main {
    background-color: var(--color-bg-2);
    border-radius: 8px;
    padding: 0.5rem;

    > strong {
      display: block;
      margin-bottom: 0.5rem;
    }
  }

  a {
    display: block;
    padding: 0.4rem 0.6rem;
    margin-bottom: 0.4rem;
    background-color: var(--color-bg-2);
    font-size: var(--font-size-xs);
    color: var(--color-font-light);
    line-height: 1.3;
    border-radius: 0.5rem;

    &:hover,
    &:active {
      background-color: var(--color-bg-4);
    }

    &.active {
      background-color: var(--color-bg-4);
      font-weight: 500;
    }
  }

  article {
    > section {
      padding-left: 0.75rem;
    }
    > span {
      font-size: var(--font-size-xs);
      opacity: 0.8;
    }
  }
}
</style>
