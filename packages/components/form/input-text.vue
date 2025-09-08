<template>
  <div class="c-input-text">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div class="form-control-wrap">
      <slot name="pre-input"></slot>
      <input
        type="text"
        :class="['form-control']"
        @focus="onFocus"
        @input="onChange"
        @keydown.enter="onEnterKey"
        :value="value"
        :placeholder="placeholder"
        :maxlength="max"
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

  props: {
    type: {
      type: String,
      default: "text"
    },
    value: {
      type: String,
      default: ""
    },
    name: String,
    label: String,
    successMessage: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    handleChange: {},
    max: {
      type: Number,
      default: null
    }
  },

  methods: {
    onFocus(e) {
      this.$emit("focus:event", e);
    },
    onEnterKey(e) {
      this.$emit("enter:event", e);
    },
    onChange(e) {
      let val = e.target.value;

      // If max prop is set, truncate the value
      if (this.max !== null) {
        val = val.slice(0, this.max);
      }

      if (this.handleChange) {
        this.handleChange({ ...e, target: { ...e.target, value: val } });
      } else {
        this.$emit("update:value", val);
      }
    }
  }
};
</script>

<style></style>
