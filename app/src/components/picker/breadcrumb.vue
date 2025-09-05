<template>
  <div class="c-picker-breadcrumb">
    <router-link to="/dashboards">
      <span> Dashboards </span>
    </router-link>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 16L13.4697 12.5303C13.7626 12.2374 13.7626 11.7626 13.4697 11.4697L10 8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <router-link to="/picker">
      <span> Create Widget </span>
    </router-link>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 16L13.4697 12.5303C13.7626 12.2374 13.7626 11.7626 13.4697 11.4697L10 8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <a href="#">
      <span> Customize Widget </span>
    </a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.c-picker-breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}
</style>
