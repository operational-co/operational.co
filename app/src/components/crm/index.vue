<template>
  <div class="c-crm">
    <Constrain>
      <h3>Crm</h3>
      <Search ref="search" v-model:value="query"></Search>
      <div class="c-activity__list" v-for="(item, i) in computedItems" :key="i">
        <Item :item="item"> </Item>
      </div>
    </Constrain>
  </div>
</template>

<script>
import moment from "moment";

import Constrain from "@operational.co/components/ui/constrain.vue";

import Item from "./item.vue";

import Search from "@/components/search/index.vue";

export default {
  components: {
    Constrain,
    Item,
    Search,
  },

  data: function () {
    return {
      query: "",
      lock: false,
      modalConfirmActive: false,
      currentAction: null,
    };
  },

  computed: {
    items: function () {
      return this.$store.crm.resources;
    },
    computedItems: function () {
      return this.items;
    },
  },

  methods: {
    handleScroll() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollPosition = window.scrollY;
      const threshold = 150; // Adjust as needed

      if (currentScrollPosition + threshold >= scrollableHeight) {
        this.onBottomReached();
      }
    },
    async onBottomReached() {
      if (this.lock) {
        return;
      }
      this.lock = true;

      const params = {
        query: this.query,
        skip: this.$store.crm.take + this.$store.crm.skip,
      };
      this.$store.app.setLoading(true);
      await this.$store.crm.setParams(params);
      this.$store.app.setLoading(false);

      this.lock = false;
    },
  },

  async mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="scss">
.c-crm {
  margin: 0 auto;
  padding: var(--spacer-sm) 0;

  &__list {
    padding-top: 8px;

    > span {
      font-size: var(--font-size-sm);
      display: block;
      padding: 4px 0;
      padding-bottom: 12px;
      opacity: 0.75;
      text-align: center;
    }
  }
}

.ptr--text {
  color: var(--color-font) !important;
  font-weight: 500;
}
</style>
