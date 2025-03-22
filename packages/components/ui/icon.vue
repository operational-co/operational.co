<template>
  <div class="c-icon">
    <svg v-if="!name" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.5 15.5L20.5 20.5M17.5 10.5C17.5 14.366 14.366 17.5 10.5 17.5C6.63401 17.5 3.5 14.366 3.5 10.5C3.5 6.63401 6.63401 3.5 10.5 3.5C14.366 3.5 17.5 6.63401 17.5 10.5Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      v-if="name === 'cross'"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 18L18 6M6 6L18 18"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.c-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: hsl(var(--p), 0%, 46%);
}
</style>
