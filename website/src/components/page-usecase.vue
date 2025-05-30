<template>
  <div class="c-page-usecase">
    <PageHeader>
      <template #title>
        <a class="byline" href="/usecases"> Back </a>
        <h1>{{ title }}</h1>
      </template>
      <template #body>
        <p>{{ description }}</p>
        <img :src="banner" />
      </template>
    </PageHeader>
    <Constrain size="sm">
      <template #default>
        <div class="c-page-usecase__content article-content">
          <slot></slot>
        </div>
      </template>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";
import Toc from "@operational.co/components/ui/toc.vue";
import PageHeader from "./page-header.vue";

export default {
  components: {
    Constrain,
    Subtitle,
    Toc,
    PageHeader,
  },

  props: {
    data: {},
    pathname: {},
  },

  computed: {
    title: function () {
      return this.data.remarkPluginFrontmatter.title;
    },
    description: function () {
      return this.data.remarkPluginFrontmatter.description;
    },
    banner: function () {
      let slug = this.data.remarkPluginFrontmatter.slug;

      return `/images/usecases/${slug}.webp`;
    },
  },
};
</script>

<style lang="scss">
.c-page-usecase {
  // padding: 3rem 0;
  // background-color: var(--color-bg-2);
  // border-top: var(--color-bg-4) solid 1px;

  .c-constrain {
    &__inner {
      //padding: 2rem 1rem;
      //background-color: var(--color-bg-4);
      //border-radius: 1rem;
      //overflow-x: hidden;
    }
  }

  .c-page-header {
    h1 {
      display: block;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    p {
      margin-bottom: 2rem;
      max-width: 80%;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    img {
      display: block;
      margin-bottom: 2rem;
      border-radius: 1rem;
      border: var(--color-bg-3) solid 4px;
    }
  }

  &__content {
    margin-bottom: 4rem;
  }

  @media screen and (max-width: 980px) {
    padding-top: 0;

    .c-constrain {
      &__sidebar {
        margin-bottom: 0 !important;
        border-radius: 0 !important;
      }
      &__inner {
        border-radius: 0;
      }
    }
  }

  @media screen and (max-width: 576px) {
    .c-page-header {
      img {
        border-radius: 0.5rem;
        margin-bottom: 0;
      }
    }
  }
}
</style>
