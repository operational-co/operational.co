<template>
  <div class="c-input-code">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div class="form-control-wrap">
      <slot name="pre-input"></slot>
      <!-- <input
        type="text"
        :class="['form-control']"
        @focus="onFocus"
        @input="onChange"
        :value="value"
        :placeholder="placeholder"
      /> -->
      <input
        v-for="(digit, index) in digits"
        :key="index"
        v-model="digits[index]"
        :ref="`input${index}`"
        @input="handleInput(index)"
        @keydown="handleKeyDown(index, $event)"
        class="form-control"
        type="text"
        maxlength="1"
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
    return {
      digits: ["", "", "", ""]
    };
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
    handleChange: {}
  },

  watch: {
    digits: {
      handler(newDigits) {
        // Join digits to form the complete code and emit it
        const code = newDigits.join("");
        this.$emit("update:modelValue", code);
      },
      deep: true // Watch for changes within the array
    }
  },

  methods: {
    onFocus: function (e) {
      this.$emit("focus:event", e);
    },

    handleInput(index) {
      // Move focus to the next input when a digit is entered
      if (this.digits[index] && index < this.digits.length - 1) {
        let ref = this.$refs[`input${index + 1}`];

        if (ref && ref[0].focus) {
          ref[0].focus();
        }
      }
    },
    handleKeyDown(index, event) {
      // Handle backspace to move to previous input
      if (event.key === "Backspace" && !this.digits[index] && index > 0) {
        let ref = this.$refs[`input${index - 1}`];

        if (ref && ref[0].focus) {
          ref[0].focus();
        }
      }
    }
  }
};
</script>

<style lang="scss">
.c-input-code {
  .form-control-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: var(--margin);

    .form-control {
      text-align: center;
    }
  }
}
</style>
