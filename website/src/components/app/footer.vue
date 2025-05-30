<template>
  <div class="c-footer">
    <div class="c-footer__inner">
      <div class="c-footer__left">
        <a class="logo" href="/">
          <h1>Operational</h1>
        </a>
        <p>Event tracker for your product.</p>

        <a data-astro-prefetch class="muted" href="/privacy">Privacy</a>
        <a data-astro-prefetch class="muted" href="/terms">Terms</a>
      </div>
      <div class="c-footer__right">
        <section>
          <strong> About the product </strong>
          <ul>
            <li v-for="(link, i) in productLinks" :key="i">
              <a :href="`${link.slug}`">
                {{ link.title }}
              </a>
            </li>
          </ul>
        </section>
        <section>
          <strong> Related to the product </strong>
          <ul>
            <li v-for="(link, i) in relatedLinks" :key="i">
              <a :href="`${link.slug}`">
                {{ link.title }}
              </a>
            </li>
          </ul>
        </section>
        <section>
          <strong> Useful articles for your business </strong>
          <ul>
            <li v-for="post in computedPosts" :key="post.id">
              <a data-astro-prefetch :href="`/articles/${post.slug}`">
                {{ post.title }}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      productLinks: [
        // {
        //   slug: "/pricing",
        //   title: "Pricing"
        // },
        {
          slug: "/usecases",
          title: "Use cases",
        },
        {
          slug: "/playground",
          title: "Playground",
        },
        {
          slug: "/api",
          title: "API",
        },
        {
          slug: "/pitch",
          title: "Pitch",
        },
        {
          slug: "/wordpress",
          title: "Wordpress plugin",
        },
        {
          slug: "/bubble",
          title: "Bubble plugin",
        },
      ],
      relatedLinks: [
        {
          slug: "/vs-logsnag",
          title: "VS Logsnag",
        },
        {
          slug: "/open-source",
          title: "Open Source",
        },
        {
          slug: "/articles",
          title: "Articles",
        },
      ],
    };
  },

  props: {
    posts: {},
  },

  computed: {
    computedPosts: function () {
      if (!this.posts) {
        return [];
      }

      let newPosts = JSON.parse(JSON.stringify(this.posts));

      return newPosts.slice(0, 4);
    },
  },
};
</script>

<style lang="scss">
.c-footer {
  padding: 4rem 0;
  border-top: var(--color-bg-4) solid 1px;

  &__inner {
    max-width: 740px;
    margin: 0 auto;

    display: grid;
    grid-template-columns: 0.75fr 1.25fr;
    grid-column-gap: var(--margin-lg);
    padding: 0 var(--margin-lg);
  }

  &__left {
    p {
      margin-bottom: 0.5rem;
    }
  }

  &__right {
    text-align: right;

    section {
      margin-bottom: 1rem;
    }

    a {
      display: block;
    }

    strong {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      color: var(--color-font-heading);
    }
  }

  .muted {
    display: inline-block;
    margin-right: var(--margin);
    font-size: var(--font-size-sm);
    color: var(--color-font);
    opacity: 0.8;

    &:hover,
    &:active {
      opacity: 1;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: block;
      margin-left: var(--margin);

      & + li {
        margin-top: 0.25rem;
      }

      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
    }

    a {
      display: inline-block;
      color: var(--color-font);
      opacity: 0.8;

      &:hover,
      &:active {
        opacity: 1;
      }
    }
  }

  .logo {
    position: relative;
    margin-right: auto;

    display: flex;
    align-items: center;

    margin-bottom: 1rem;

    h1 {
      display: inline-block;
      font-size: var(--font-size-lg);
      margin: 0;
      color: var(--color-font);
      transition: all var(--transition-time) linear;

      &:hover,
      &:active {
        color: var(--color-primary-light);
      }
    }

    span {
      display: inline-block;
      padding: var(--margin);
      margin-left: var(--margin);
      font-size: var(--font-size-sm);
      font-weight: 500;
      font-family: var(--font-family-monospace);
      line-height: 1;
      color: var(--color-font-light);
      background-color: var(--color-bg-2);
      border-radius: var(--border-radius);
    }

    &:after {
      content: "Beta";
      display: inline-block;
      line-height: 1;
      margin-left: var(--margin);
      font-family: var(--font-family-monospace);
      font-size: var(--font-size-sm);
      font-weight: 500;
      background-color: var(--color-bg-3);
      padding: var(--margin-sm) var(--margin);
      border-radius: var(--border-radius-sm);
      color: var(--color-font);
    }
  }

  @media screen and (max-width: 576px) {
    background-color: var(--color-bg-2);
    padding: 3rem 0;

    .logo {
      margin-bottom: 0.5rem;
    }

    &__inner {
      display: block;
    }

    &__left {
      margin-bottom: 1rem;

      p {
        display: none;
      }
    }

    &__right {
      text-align: left;
    }

    ul {
      li {
        margin-left: 0;
        margin-right: var(--margin);
      }

      a {
        padding: var(--margin-sm) 0;
      }
    }
  }
}
</style>
