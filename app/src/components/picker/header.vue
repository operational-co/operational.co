<template>
  <div class="c-picker-header">
    <header>
      <h3>Action button</h3>
      <p>Use Action buttons to trigger webhooks on your server.</p>
      <p>
        For instance, you can pair it up with a function on your server to generate and mail
        yourself a GST csv.
      </p>
    </header>
    <Preview></Preview>
  </div>
</template>

<script>
import Preview from "./preview.vue";
export default {
  components: {
    Preview,
  },
};
</script>

<style lang="scss">
.c-picker-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  header {
    padding-right: 1rem;

    h3 {
      margin-bottom: 0.5rem;
    }
    p {
      font-size: var(--font-size-sm);
      line-height: 1.5;
      opacity: 0.9;
    }
  }
}
</style>
