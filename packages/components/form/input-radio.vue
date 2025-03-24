<template>
  <div class="c-input-radio">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div class="form-control-wrap">
      <slot name="pre-input"></slot>
      <div class="c-input-radio__inner">
        <div
          :class="['c-input-radio__item', { active: val === option.key || option.value }]"
          v-for="(option, i) in options"
          :key="i"
          @click.prevent="toggleSlug(option)"
        >
          <input class="form-control" type="radio" :value="option.value || option.key" v-model="val" />
          <label>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17.5694 9.48809C17.839 9.1736 17.8026 8.70012 17.4881 8.43056C17.1736 8.16099 16.7001 8.19741 16.4306 8.51191L10.9576 14.897L7.53033 11.4697C7.23744 11.1768 6.76256 11.1768 6.46967 11.4697C6.17678 11.7626 6.17678 12.2374 6.46967 12.5303L10.4697 16.5303C10.6174 16.6781 10.82 16.7575 11.0288 16.7494C11.2375 16.7414 11.4335 16.6467 11.5694 16.4881L17.5694 9.48809Z"
                fill="currentColor"
              />
            </svg>
            <span>
              {{ option.key }}
            </span>
          </label>
        </div>
      </div>
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
      val: null
    };
  },

  watch: {
    val: function () {
      this.onChange({
        target: {
          value: this.value
        }
      });
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
    options: {
      default: function () {
        return [];
      }
    },
    handleChange: {}
  },

  methods: {
    toggleSlug: function (option) {
      if (!option) {
        this.val = null;
        return;
      }

      let val = option.value || option.key;

      this.val = val;
    },
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

<style lang="scss">
.c-input-radio {
  &__inner {
    display: flex;
    flex-direction: column;
    width: 100%;

    border: var(--color-input-background) solid 1px;
    border-radius: var(--border-radius);
    overflow: hidden;

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0px 0px;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: var(--margin-lg);
    cursor: pointer;
    user-select: none;
    border-radius: var(--border-radius);
    transition: all var(--transition-time-sm) ease-out;

    input.form-control {
      display: none;
    }

    &:hover {
      background-color: var(--color-bg-4);
    }

    label {
      margin: 0;
      display: flex;
      align-items: center;
      font-size: var(--font-size-sm);

      cursor: pointer;

      svg {
        min-width: 24px;
        opacity: 0.5;
        margin-right: var(--margin);
      }
    }

    &.active {
      svg {
        color: var(--color-primary-light);
        opacity: 1;
      }
    }
  }
}
</style>
