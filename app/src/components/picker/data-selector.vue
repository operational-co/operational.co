<template>
  <div class="c-data-selector">
    <label v-if="labelText">
      {{ labelText }}
    </label>
    <div class="c-data-selector__wrap">
      <InputSelect v-model:value="selector" :options="selectorOptions"></InputSelect>
      <InputSelect v-model:value="condition" :options="conditionOptions"></InputSelect>
      <InputEvents v-model:value="text"></InputEvents>
      <div class="c-data-selector__actions">
        <a v-if="allowDelete" class="btn" @click="onDelete">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8L16 16M16 8L8 16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </a>
        <a v-if="allowAdd" class="btn" @click="onAdd">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 7V12M12 12V17M12 12H7M12 12H17"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import InputSelect from "@operational.co/components/form/input-select.vue";
import InputText from "@operational.co/components/form/input-text.vue";
import InputEvents from "@operational.co/components/form/input-events.vue";

import { appApi } from "@/store/app.js";

export default {
  components: { InputSelect, InputText, InputEvents },

  data: function () {
    return {
      selector: "event",
      selectorOptions: [
        {
          key: "event",
          value: "event",
        },
        {
          key: "category",
          value: "category",
        },
      ],

      condition: "=",
      conditionOptions: [
        {
          key: "=",
          value: "=",
        },
        {
          key: "!=",
          value: "!=",
        },
      ],

      text: "",
    };
  },

  watch: {
    selector: function () {
      this.onUpdate();
    },
    condition: function () {
      this.onUpdate();
    },
    text: function () {
      this.onUpdate();
    },
  },

  props: {
    allowAdd: {
      type: Boolean,
      default: false,
    },
    allowDelete: {
      type: Boolean,
      default: false,
    },
    dataSelector: {},
    i: {},
    labelText: {
      type: String,
      default: null,
    },
  },

  computed: {},

  methods: {
    onAdd: function () {
      this.$emit("add");
    },
    onDelete: function () {
      this.$emit("delete");
    },
    onUpdate: function () {
      let selector = {
        selector: this.selector,
        condition: this.condition,
        text: this.text,
        i: this.i,
      };
      this.$emit("update", selector);
    },
  },

  mounted: function () {
    this.selector = this.dataSelector.selector;
    this.condition = this.dataSelector.condition;
    this.text = this.dataSelector.text;
  },
};
</script>

<style lang="scss">
.c-data-selector {
  margin-bottom: 0.5rem;

  > label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 450;
    font-size: var(--font-size-sm);
  }

  &__wrap {
    display: grid;
    grid-template-columns: max-content max-content 1fr max-content;
    grid-column-gap: 0.5rem;
  }

  .c-input-select {
    min-width: 100px;
  }

  .form-control {
    margin-bottom: 0;
  }

  &__actions {
    display: flex;
    align-items: center;

    .btn {
      min-width: 38px;
      height: 100%;

      &:nth-child(2) {
        margin-left: 0.5rem;
      }
    }
  }
}
</style>
