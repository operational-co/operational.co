<template>
  <div class="c-input-password">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div class="form-control-wrap">
      <slot name="pre-input"></slot>
      <input
        type="password"
        :class="['form-control']"
        @input="onChange"
        :value="value"
        :placeholder="placeholder"
        autocomplete="current-password"
      />
      <slot name="post-input"></slot>
    </div>
  </div>
</template>

<script>
import { Field, Form, ErrorMessage } from "vee-validate";

export default {
  components: {
    Field
  },

  data: function () {
    return {};
  },

  props: {
    type: {
      type: String,
      default: "text"
    },
    value: {
      type: String,
      default: ""
    },
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
      default: "********"
    },
    handleChange: {}
  },

  methods: {
    onChange: function (e) {
      if (this.handleChange) {
        this.handleChange(e);
      } else {
        this.$emit("update:value", e.target.value);
      }
    }
  }
};
</script>

<style></style>
