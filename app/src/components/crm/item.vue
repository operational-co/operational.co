<template>
  <div class="c-crm-item" @click="onClick"></div>
</template>

<script>
export default {
  components: {},

  props: {
    item: {},
  },

  data: function () {
    return {
      expanded: false,
      colors: ["#8ee6c3", "#2fb8da", "#0679b2", "#ffb703", "#fb8500"],
    };
  },

  computed: {
    date: function () {
      return "";
    },
  },

  methods: {
    onClick: function () {
      this.toggleExpansion();
    },
    toggleExpansion: function () {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style lang="scss">
.c-crm-item {
  margin-bottom: var(--margin);
  padding: var(--margin-lg);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  background-color: var(--color-bg-4);

  cursor: pointer;

  //background-color: var(--color-bg-2);
  //box-shadow: inset 0 1px 8px 0 rgba(255, 255, 255, 0.05), 0 1px 4px #00000020;

  &__inner {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    grid-column-gap: 10px;
    user-select: none;

    > div {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background-color: #000;
      font-size: var(--font-size-lg);
      font-weight: 200;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      }
    }

    > span {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(180deg);
      user-select: none;
      cursor: pointer;

      &.active {
        transform: rotate(0deg);
      }
    }
  }

  &__date {
    display: block;
    min-width: 85px;
    font-size: var(--font-size-xs);
    opacity: 0.8;
  }

  article {
    > a {
      display: block;
    }
  }

  .c-card {
    margin-top: 8px;
  }
}
</style>
