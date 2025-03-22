<template>
  <div class="c-input-switch">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <label class="c-switch">
      <input :disabled="isSwitchDisabled" @input="onChange" :value="value" type="checkbox" checked />
      <span class="c-switch__slider">
        <span class="c-switch__toggle"> </span>
      </span>
    </label>
  </div>
</template>

<script>
import { Field, Form, ErrorMessage } from "vee-validate";

export default {
  components: {
    Field,
  },

  data: function () {
    return {};
  },

  props: {
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    successMessage: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    handleChange: {},
  },

  methods: {
    onChange: function (e) {
      if (this.handleChange) {
        this.handleChange(e);
      } else {
        this.$emit("update:value", e.target.value);
      }
    },
  },
};
</script>

<style></style>
