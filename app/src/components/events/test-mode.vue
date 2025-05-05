<template>
  <div :class="['c-events-test-mode', { active: testMode === true }]">
    <span> Test mode </span>
    <label class="c-switch">
      <input v-model="testMode" type="checkbox" checked />
      <span class="c-switch__slider">
        <span class="c-switch__toggle"> </span>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      testMode: false,
    };
  },

  watch: {
    testMode: function () {
      this.onTestMode(this.testMode);
    },
  },

  methods: {
    async onTestMode(testMode) {
      let condition = "off";
      if (testMode) {
        condition = "on";
      }
      this.$store.app.setTestMode(testMode);
      this.$store.app.sendNotification(`Test mode is ${condition}`);
    },
  },

  created: function () {
    this.testMode = this.$store.app.testMode;
  },
};
</script>

<style lang="scss">
.c-events-test-mode {
  display: flex;
  align-items: center;
  padding-right: 0;

  span {
    font-size: var(--font-size-sm);
    margin-right: var(--margin);
    opacity: 0.8;
  }

  &.active {
    span {
      opacity: 1;
    }
  }
}
</style>
