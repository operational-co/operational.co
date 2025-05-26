<template>
  <div class="c-prevnext">
    <a :title="prev.name" v-if="prev" class="c-prevnext__item btn" :href="prev.slug">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM10.2929 15.7071C10.6834 16.0976 11.3166 16.0976 11.7071 15.7071C12.0976 15.3166 12.0976 14.6834 11.7071 14.2929L10.4142 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H10.4142L11.7071 9.70711C12.0976 9.31658 12.0976 8.68342 11.7071 8.29289C11.3166 7.90237 10.6834 7.90237 10.2929 8.29289L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071L10.2929 15.7071Z"
          fill="currentColor"
        />
      </svg>

      <span> {{ prev.name }} </span>
    </a>
    <span v-else></span>

    <a :title="next.name" v-if="next" :class="['c-prevnext__item btn', 'next']" :href="next.slug">
      <span> {{ next.name }} </span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13.7071 8.29289C13.3166 7.90237 12.6834 7.90237 12.2929 8.29289C11.9024 8.68342 11.9024 9.31658 12.2929 9.70711L13.5858 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H13.5858L12.2929 14.2929C11.9024 14.6834 11.9024 15.3166 12.2929 15.7071C12.6834 16.0976 13.3166 16.0976 13.7071 15.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L13.7071 8.29289Z"
          fill="currentColor"
        />
      </svg>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    prev: {},
    next: {}
  }
};
</script>

<style lang="scss">
.c-prevnext {
  margin-top: var(--spacer);
  display: grid;
  grid-template-columns: max-content max-content;
  justify-content: space-between;
  grid-column-gap: var(--spacer);

  &__item {
    display: inline-flex;

    border-radius: 99px;
    font-weight: 600;
    transition: all var(--transition-time) ease;

    &.btn {
      padding: var(--margin-lg) var(--spacer-sm);
      padding-left: 8px;
    }

    svg {
      margin-right: var(--margin);
    }

    &.next {
      &.btn {
        padding-left: var(--spacer-sm);
        padding-right: 8px;
      }

      svg {
        margin-right: 0;
        margin-left: var(--margin);
      }
    }

    &:hover,
    &:active,
    &:focus {
    }
  }

  @media screen and (max-width: 576px) {
    display: flex;
    flex-direction: column;

    &__item {
      margin-top: 0.5rem;
      font-size: var(--font-size-sm);
      justify-content: flex-start;

      &:first-child {
        margin-top: 0;
      }

      &.next {
        justify-content: flex-end;
      }
    }
  }
}
</style>
