<template>
  <div class="c-input-select">
    <label v-if="label" :for="name">{{ label }}</label>

    <select class="form-control" v-model="text">
      <option v-for="(option, i) in options" :key="i" :value="option.value">
        {{ getKey(option) }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      text: "http",
    };
  },

  watch: {
    text: {
      handler: function () {
        this.onChange({
          target: {
            value: this.text,
          },
        });
      },
      immediate: false,
    },
    value: function () {
      console.log(this.value, this.text);
      // if (this.value !== this.text) {
      //   this.text = this.value;
      // }
    },
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
    options: {
      type: Object,
      default: () => {
        return [];
      },
    },
    handleChange: {},
  },

  methods: {
    getKey: function (option) {
      return option.key || option.value;
    },
    isSelected: function (option) {
      if (option.value === this.text) {
        return "selected";
      }
      return;
    },
    onChange: function (e) {
      if (this.handleChange) {
        this.handleChange(e);
      } else {
        this.$emit("update:value", e.target.value);
      }
    },
  },

  mounted: function () {
    if (this.value && typeof this.value === "string") {
      if (this.value.target) {
        this.text = this.value.target;
      } else {
        this.text = this.value;
      }
    }
  },
};
</script>

<style></style>
