<template>
  <div :class="['c-article-card', { compact: type === 'compact' }]" v-if="post">
    <a :href="`/articles/${post.slug}`" class="c-article-card__clickable">
      <img
        class="c-article-card__img"
        v-if="post.banner"
        :src="`https://writings.operational.co/assets/${post.banner}?format=webp&quality=70`"
      />
      <div class="c-article-card__footer">
        <h2 class="h4">
          {{ post.title }}
        </h2>
        <article>
          <p>
            {{ post.subtitle }}
          </p>
        </article>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    post: {},
    type: {
      type: String
    }
  }
};
</script>

<style lang="scss">
.c-article-card {
  border: var(--color-border-primary) solid 1px;
  display: flex;
  align-items: flex-start;

  > a {
    display: block;
    padding: var(--spacer-sm);
    color: var(--color-font);
    border-radius: var(--border-radius-lg);
    transition: all var(--transition-time) ease-out;

    isolation: isolate;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(35, 35, 38, 0.6) 0.01%, rgba(46, 46, 52, 0.5) 100%),
      linear-gradient(rgba(35, 35, 38, 0.2) 0.01%, rgba(46, 46, 52, 0.2) 100%);
    border-radius: var(--border-radius-xl);
    padding: var(--spacer);
    overflow: hidden;

    &:hover,
    &:active,
    &:focus {
      filter: brightness(125%);
      color: var(--color-font);
    }
  }

  &__img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: var(--border-radius);

    margin-bottom: var(--spacer-sm);
  }

  article {
    p:last-child {
      margin-bottom: 0;
    }
  }

  &.compact {
    img {
      margin-bottom: 0;
    }

    > a {
      display: grid;
      grid-template-columns: 256px 1fr;
      grid-column-gap: 1.5rem;
    }

    .c-article-card__footer {
      align-self: center;
    }
  }

  @media screen and (max-width: 520px) {
    &__img {
      height: 260px;
    }

    a {
      padding: var(--margin-lg);
    }

    &.compact {
      > a {
        display: block;
      }
    }
  }
}
</style>
