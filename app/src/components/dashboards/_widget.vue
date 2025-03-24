<template>
  <div class="c-reports-widget">
    <h1>1,337</h1>

    <h3>Average Ads saved over the last 7 days</h3>
  </div>
</template>

<script>
export default {
  props: {},
};
</script>

<style lang="scss">
.c-reports-widget {
  width: 100%;
  height: 100%;
  position: relative;
  padding: var(--spacer-sm);
  border-radius: var(--border-radius-lg);

  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--color-bg-4);

  h3 {
    //position: absolute;
    //bottom: var(--spacer);
    left: var(--spacer);
    width: calc(100% - var(--spacer) * 2);
    opacity: 0.85;
    font-size: var(--font-size);
  }

  h1 {
    font-family: var(--font-family-monospace); //"PP Editorial New";
    font-size: var(--font-size-xxxl);
  }
}
</style>
