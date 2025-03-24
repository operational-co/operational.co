<template>
  <div class="c-usecases-related">
    <Constrain>
      <div class="c-usecases-related__header">
        <span> More usecases </span>
      </div>
      <div class="c-usecases-related__list">
        <a :href="post.path" v-for="(post, i) in computedList" :key="i">
          <span>{{ post.name }}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";

export default {
  components: {
    Constrain,
    Subtitle
  },

  props: {
    currentPost: {},
    posts: {}
  },

  computed: {
    computedList: function () {
      let posts = this.posts;

      let post = this.currentPost;
      let currentSlug = post.path.split("/");
      currentSlug = currentSlug[currentSlug.length - 1];

      posts = posts.filter((p) => {
        let slug = p.path.split("/");
        slug = slug[slug.length - 1];

        if (slug === currentSlug) {
          return false;
        }
        return true;
      });

      return posts;
    }
  }
};
</script>

<style lang="scss">
.c-usecases-related {
  padding: 4rem 0;

  &__header {
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
    }
  }
}
</style>
