<template>
  <div class="c-input-checkbox-group">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div class="form-control-wrap">
      <slot name="pre-input"></slot>
      <div class="c-input-checkbox-group__inner">
        <div
          :class="['c-input-checkbox-group__item', { active: selected.includes(option.value || option.key) }]"
          v-for="(option, i) in options"
          :key="i"
          @click.prevent="toggleSlug(option.value || option.key)"
        >
          <input
            name="input-options"
            class="form-control"
            type="checkbox"
            :value="option.value || option.key"
            v-model="selected"
          />
          <label>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
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
import { toRaw } from "vue";

export default {
  components: {
    Field
  },

  data: function () {
    return {
      selected: []
    };
  },

  watch: {
    selected: {
      handler(newVal) {
        this.onChange(newVal);
      },
      deep: true
    }
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
    options: {
      default: function () {
        return [];
      }
    },
    handleChange: {}
  },

  methods: {
    toggleSlug: function (slug) {
      if (this.selected.includes(slug)) {
        let i = this.selected.indexOf(slug);
        if (i > -1) {
          this.selected.splice(i, 1);
        }
      } else {
        this.selected.push(slug);
      }
    },
    onFocus: function (e) {
      this.$emit("focus:event", e);
    },
    onEnterKey: function (e) {
      this.$emit("enter:event", e);
    },
    onChange: function (e) {
      e = toRaw(e);
      if (this.handleChange) {
        this.handleChange(e);
      } else {
        this.$emit("update:value", e);
      }
    }
  }
};
</script>

<style lang="scss">
.c-input-checkbox-group {
  margin-bottom: 0.5rem;

  &__inner {
    display: flex;
    flex-direction: column;
    width: 100%;

    border: var(--color-input-background) solid 1px;
    border-radius: var(--border-radius);
    overflow: hidden;

    display: grid;
    grid-template-columns: 1fr 1fr;

    gap: var(--margin);
  }

  &__item {
    display: flex;
    align-items: center;
    padding: var(--margin-lg);
    cursor: pointer;
    user-select: none;
    border-radius: var(--border-radius);
    background-color: var(--color-bg-2);
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
      background-color: var(--color-bg-4);
      color: var(--color-primary-light);
      svg {
        color: var(--color-primary-light);
        opacity: 1;
      }
    }
  }
}
</style>
