<template>
  <div class="c-picker-webhook">
    <h3>Send your server's data</h3>
    <p>Here's how it works:</p>
    <p>We ping your server at {{ webhook }}</p>
    <p>You return data in a certain format.</p>
    <p>If it works, we'll cache the data and ping your server every {{ duration }}</p>
    <strong> Quick start: </strong>
    <p>Paste this code in your server:</p>
    <Code :text="codeText"></Code>
  </div>
</template>

<script>
import InputSelect from "@operational.co/components/form/input-select.vue";
import InputText from "@operational.co/components/form/input-text.vue";
import Code from "@operational.co/components/code/index.vue";

export default {
  components: {
    InputSelect,
    InputText,
    Code,
  },

  data: function () {
    return {
      codeText: `
      async function() {
      }
      `,
    };
  },

  computed: {
    webhook: function () {
      return `https://api.swipekit.app/api`;
    },
    duration: function () {
      return `10 minutes`;
    },
  },
};
</script>

<style lang="scss">
.c-picker-webhook {
}
</style>
