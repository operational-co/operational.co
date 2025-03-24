<template>
  <div :class="['c-api-item', { active: active === true }]">
    <div class="c-api-item__header" @click="onClick">
      <strong>
        {{ title }}
      </strong>
      <span>
        {{ type }}
      </span>
      <span>
        <template v-if="required === 'true'"> required </template>
      </span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="c-api-item__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      active: false
    };
  },

  props: {
    title: {},
    type: {
      type: String,
      default: ""
    },
    required: {
      type: String,
      default: false
    }
  },

  methods: {
    onClick: function () {
      this.active = !this.active;
    }
  }
};
</script>

<style lang="scss">
.c-api-item {
  margin-top: -1px;

  border-top: var(--color-bg-3) solid 1px;
  border-bottom: var(--color-bg-3) solid 1px;

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    cursor: pointer;
    padding: var(--margin-lg) 0;

    span {
      display: inline-block;
      margin-left: var(--margin);
      opacity: 0.75;
    }

    svg {
      position: absolute;
      top: var(--margin-lg);
      right: 0;
      opacity: 0.65;
    }

    &:hover {
      svg {
        opacity: 1;
      }
    }
  }

  &__body {
    display: none;
    padding-top: var(--margin);
    padding-bottom: var(--margin-lg);
    font-size: var(--font-size-sm);
  }

  &.active {
    .c-api-item__header {
      svg {
        transform: rotate(180deg);
        opacity: 1;
      }
    }
    .c-api-item__body {
      display: block;
    }
  }

  p {
    margin-bottom: 0.5rem;
  }

  p:last-child {
    margin-bottom: 0;
  }
}
</style>
