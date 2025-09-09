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
        :maxlength="maxlength"
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
      default: ""
    },
    handleChange: {},

    maxlength: {
      type: Number,
      default: -1
    }
  },

  methods: {
    onFocus: function (e) {
      this.$emit("focus:event", e);
    },
    onEnterKey: function (e) {
      this.$emit("enter:event", e);
    },
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
