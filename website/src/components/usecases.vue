<template>
  <div class="c-usecases">
    <Constrain>
      <header>
        <strong>By tags</strong>
        {{ tags }}
      </header>
      <ul>
        <li v-for="(item, i) in computedList" :key="i">
          <a :href="`/usecases/${item.data.slug}`">
            <img :src="`/images/usecases/${item.data.slug}.webp`" />
            <article>
              <h3>{{ item.data.emoji }} {{ item.data.title }}</h3>
              <p>
                {{ item.data.description }}
              </p>
            </article>
          </a>
        </li>
      </ul>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";

export default {
  components: {
    Constrain,
  },

  props: {
    list: {},
  },

  computed: {
    computedList: function () {
      let list = this.list;
      return list;
    },
    tags: function () {
      let items = this.list;

      if (!Array.isArray(items) || items.length === 0) {
        return [];
      }

      console.log(items);
      // Start from the first item's tags...
      return (
        items
          .map((item) => item.data.tags)
          // ...and keep only those tags that appear in every subsequent array
          .reduce((common, tags) => common.filter((tag) => tags.includes(tag)))
      );
    },
  },
};
</script>

<style lang="scss">
.c-usecases {
  header {
    margin-bottom: 1rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin: 0;
      padding: 0;

      &:before {
        display: none;
      }
      &:after {
        display: none;
      }

      a {
        width: 100%;
        background: var(--color-bg-3);
        //border: 1px solid var(--color-translucent);
        box-shadow: var(--box-shadow-low);
        border-radius: 1rem;
        overflow: hidden;
        height: 100%;
        margin-bottom: 2rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        transition: 0.18s var(--ease-out-quad);
        transition-property: box-shadow, transform;
        text-decoration: none;
        color: var(--color-font);
        cursor: pointer;

        img {
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }

        article {
          padding: 2rem;

          h3 {
            font-size: var(--font-size-lg);
            font-weight: 500;
          }

          p {
            font-size: var(--font-size-sm);
            line-height: 1.5;
            margin-bottom: 0;
          }
        }

        &:hover,
        &:active {
          box-shadow: var(--box-shadow-high);
          transform: scale(1.02);
          will-change: transform;
        }

        span {
          margin-bottom: 0.5rem;
        }

        h3 {
          margin-bottom: 0.5rem;
        }
      }
    }
  }

  @media screen and (max-width: 576px) {
    ul {
      li {
        a {
          display: block;
          border-radius: 0.5rem;

          img {
            height: 120px;
            width: 100%;
          }

          article {
            padding: 0.75rem;

            p {
              display: none;
            }

            h3 {
              font-size: var(--font-size);
              line-height: 1.4;
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
