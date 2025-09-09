<template>
  <div class="c-picker-breadcrumb">
    <router-link to="/dashboards">
      <span> Create Widget </span>
    </router-link>

    <router-link to="/picker">
      <span> Customize </span>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.c-picker-breadcrumb {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  margin-bottom: 0.5rem;

  a {
    display: block;
    padding: 0.5rem;
    border-bottom: var(--color-primary) solid 2px;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
}
</style>
