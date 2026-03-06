<template>
  <div class="p-index">
    <Constrain>
      <div class="p-index__inner">
        <div class="c-articles__grid">
          <template v-for="(post, i) in posts" :key="i">
            <ArticleCard :post="post"> </ArticleCard>
          </template>
        </div>
      </div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";

import ArticleCard from "@/components/ui/article-card.vue";

export default {
  components: {
    Constrain,
    ArticleCard
  },

  data: function () {
    return {
      route: null,
      users: [],
      query: ""
    };
  },

  props: {
    posts: {}
  },

  computed: {}
};
</script>

<style lang="scss">
.p-index {
  padding-bottom: 2rem;

  .c-articles {
    &__grid {
      margin-left: calc(0.75rem * -1);
      width: calc(100% + 0.75rem * 2);
      display: grid;
      grid-column-gap: 1rem;
      grid-row-gap: 1rem;
      grid-template-columns: 1fr 1fr;
    }
  }

  &__inner {
    padding: 0 0.75rem;
  }

  @media screen and (max-width: 520px) {
    .c-articles {
      &__grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
