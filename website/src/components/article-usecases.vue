<template>
  <div class="c-article-usecases">
    <Constrain size="sm">
      <h3>Explore Usecases</h3>
      <p>See how Operational can help you.</p>
      <div class="c-article-usecases__list">
        <a :href="`/usecases/${post.data.slug}`" v-for="(post, i) in computedList" :key="i">
          <span>{{ post.data.title }}</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 6L20 12L14 18M19 12H4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>
    </Constrain>
  </div>
</template>

<script>
import ArticleCard from "@/components/ui/article-card.vue";
import Constrain from "@operational.co/components/ui/constrain.vue";

export default {
  components: {
    ArticleCard,
    Constrain,
  },

  props: {
    nextPost: {},
    usecases: {},
  },

  computed: {
    computedList: function () {
      let posts = this.usecases;

      posts = posts.slice(0, 10);

      // posts = posts.filter((p) => {
      //   if (p.slug === this.post.slug) {
      //     return false;
      //   }
      //   if (p.slug === this.nextPost.slug) {
      //     return false;
      //   }
      //   return true;
      // });

      return posts;
    },
  },
};
</script>

<style lang="scss">
.c-article-usecases {
  position: relative;
  margin-top: 1rem;
  padding-top: 3rem;
  padding-bottom: 4rem;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 25%;
    width: 50%;
    height: 2px;
    background-color: var(--color-bg-4);
  }

  > h2 {
    text-align: center;
  }

  &__header {
    margin-top: 2rem;
    padding: 1rem 0;
    font-size: var(--font-size-sm);
    color: var(--color-font-light);
    border-bottom: var(--color-bg-3) solid 2px;
  }

  &__list {
    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--margin-lg) 0;
      color: var(--color-font);
      font-weight: 500;

      border-bottom: var(--color-bg-3) solid 1px;

      &:hover,
      &:active {
        color: var(--color-primary);
      }

      svg {
        margin-left: 0.5rem;
        min-width: 24px;
      }
    }
  }
}
</style>
