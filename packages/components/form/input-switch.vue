<template>
  <div class="c-input-switch">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <label class="c-switch">
      <input
        :disabled="isSwitchDisabled"
        @change="onChange"
        type="checkbox"
        :checked="value === true || value === 'true'"
      />
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
    Field
  },

  data: function () {
    return {
      isSwitchDisabled: false
    };
  },

  props: {
    type: {
      type: String,
      default: "text"
    },
    value: {},
    name: {
      type: String
    },
    label: {
      type: String
    },
    successMessage: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    handleChange: {}
  },

  methods: {
    onChange: function (e) {
      if (this.handleChange) {
        this.handleChange(e);
      } else {
        this.$emit("update:value", e.target.checked);
      }
    }
  }
};
</script>

<style></style>
