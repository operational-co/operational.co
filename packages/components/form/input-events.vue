<template>
  <div class="c-input-select">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div class="c-input-select__wrap">
      <select class="form-control" v-model="text" :selected="text">
        <option v-for="(option, i) in options" :key="i" :value="option.key">
          {{ getKey(option) }}
        </option>
      </select>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 10L11.4697 13.4697C11.7626 13.7626 12.2374 13.7626 12.5303 13.4697L16 10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      text: ""
    };
  },

  watch: {
    text: {
      handler: function () {
        this.onChange({
          target: {
            value: this.text
          }
        });
      },
      immediate: false
    },
    value: {
      handler: function () {},
      immediate: true
    }
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

  computed: {
    options: function () {
      let eventNames = this.workspace.eventNames || [];

      let options = [];

      for (let i = 0; i < eventNames.length; i++) {
        options.push({
          key: eventNames[i],
          value: eventNames[i]
        });
      }

      return options;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    }
  },

  methods: {
    getKey: function (option) {
      return option.value || option.key;
    },
    onChange: function (e) {
      if (this.handleChange) {
        this.handleChange(e);
      } else {
        this.$emit("update:value", e.target.value);
      }
    }
  },

  mounted: function () {
    if (this.value && typeof this.value === "string") {
      this.text = this.value;
    } else if (this.value.target) {
      this.text = this.value.target.value;
    }
  }
};
</script>

<style lang="scss">
.c-input-select {
  &__wrap {
    position: relative;

    > svg {
      position: absolute;
      top: calc(50% - 12px);
      right: 6px;
      pointer-events: none;
    }

    select {
      padding-right: 24px;
      font-weight: 450;
    }
  }
}
</style>
