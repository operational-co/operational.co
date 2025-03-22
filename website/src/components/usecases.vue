<template>
  <div class="c-usecases">
    <Constrain size="sm">
      <ul>
        <li v-for="(item, i) in list" :key="i">
          <a :href="item.path">
            <span>
              {{ item.icon }}
            </span>
            <article>
              <h3>
                {{ item.name }}
              </h3>
              <p>
                {{ item.description }}
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
    Constrain
  },

  props: {
    list: {}
  }
};
</script>

<style lang="scss">
.c-usecases {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin: 0;
      padding: 0;

      a {
        width: 100%;
        background: var(--color-bg-2);
        border: 1px solid var(--color-translucent);
        box-shadow: var(--box-shadow-low);
        border-radius: 16px;
        overflow: hidden;
        height: 100%;
        display: flex;
        margin-bottom: 1rem;
        padding: var(--spacer-sm);
        flex-direction: column;
        transition: 0.18s var(--ease-out-quad);
        transition-property: box-shadow, transform;
        text-decoration: none;
        color: var(--color-font);
        cursor: pointer;

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
}
</style>
