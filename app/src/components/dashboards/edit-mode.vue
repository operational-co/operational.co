<template>
  <div :class="['c-dashboards-edit-mode', { active: modelValue === true }]">
    <span> Edit mode </span>
    <label class="c-switch">
      <input v-model="localValue" type="checkbox" />
      <span class="c-switch__slider">
        <span class="c-switch__toggle"></span>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    localValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
        this.onMoveMode(value);
      },
    },
  },

  methods: {
    onMoveMode(value) {
      const condition = value ? "on" : "off";
      this.$store.app.setMoveMode(value);
      this.$store.app.sendNotification(`Move mode is ${condition}`);
    },
  },
};
</script>
