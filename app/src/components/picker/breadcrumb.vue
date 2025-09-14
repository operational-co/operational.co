<template>
  <div class="c-picker-breadcrumb">
    <router-link to="/dashboards">
      <span> Select widget </span>
    </router-link>

    <router-link to="/picker">
      <span> Setup widget </span>
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
  margin-bottom: 1rem;

  a {
    display: block;
    padding: 0.5rem;
    border-bottom: var(--color-primary) solid 2px;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
}
</style>
