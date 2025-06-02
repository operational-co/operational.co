<template>
  <div class="c-article-toc">
    <h4>Contents</h4>
    <ol>
      <li v-for="(item, i) in list" :key="i">
        <a :href="`${item.link}`">{{ item.title }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    list: {},
  },
};
</script>

<style lang="scss">
.c-article-toc {
  h4 {
    margin-bottom: 8px;
  }

  ol {
    margin-bottom: 0;
  }

  a {
    display: inline-block;
    padding: var(--margin-sm) var(--margin);
    border-radius: var(--border-radius);

    &:hover,
    &:active {
      background-color: var(--color-bg-2);
    }
  }
}
</style>
