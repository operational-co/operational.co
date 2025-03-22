<template>
  <div class="c-input-timezone">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div :class="['form-control-wrap', 'bzz']" @click.prevent="openPopup">
      <slot name="pre-input"></slot>
      <!-- <input
        disabled="true"
        type="text"
        :class="['form-control']"
        :value="currentTimezone"
        :placeholder="placeholder"
      /> -->
      <span class="form-control"> {{ currentTimezone }} </span>
      <slot name="post-input"></slot>
    </div>
    <Popup v-if="selector" :selector="selector" :active="popupActive" @onClose="closePopup">
      <div class="c-input-timezone__popup">
        <div class="c-input-timezone__search">
          <InputText placeholder="Search for timezone" :handleChange="handleChange"></InputText>
        </div>
        <div class="c-input-timezone__list">
          <span v-for="(item, i) in computedItems" :key="i" @click="onClick(item)">
            {{ item.text }}
          </span>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { Field, Form, ErrorMessage } from "vee-validate";
import InputText from "./input-text.vue";
import Popup from "@operational.co/components/ui/popup.vue";
import timezones from "@operational.co/lib/timezones.json";

import Fuse from "fuse.js";

export default {
  components: {
    Field,
    InputText,
    Popup,
  },

  data: function () {
    return {
      currentTimezone: "",
      query: "",
      tz: timezones,
      selector: null,
      popupActive: false,
    };
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
    handleChange: {},
  },

  watch: {
    popupActive: function () {
      if (this.popupActive) {
        setTimeout(() => {
          const firstInput = this.$el.querySelector("input");

          if (firstInput) {
            firstInput.focus();
          }
        }, 10);
      }
    },
  },

  computed: {
    computedItems: function () {
      let items = JSON.parse(JSON.stringify(this.tz));

      for (let i = 0; i < items.length; i++) {
        let text = items[i].text;
        let searchText = text.substring(text.indexOf(")") + 2);
        items[i].searchText = searchText;
      }

      if (!this.query) {
        return items;
      }

      let search = this.search(items, this.query);

      return search;
    },
  },

  methods: {
    handleChange: function (e) {
      let val = e.target.value;

      this.query = val;
    },
    openPopup: function () {
      this.popupActive = true;
    },
    closePopup: function () {
      this.popupActive = false;
    },
    onClick: function (item) {
      this.currentTimezone = item.text;
      this.$emit("update:value", item.text);
    },
    search: function (list, query) {
      console.log(list.length);
      const options = {
        includeScore: false,
        keys: ["searchText"],
        //threshold: 0.2,
        //findAllMatches: true,
        //distance: 20,
      };

      const fuse = new Fuse(list, options);

      const result = fuse.search(query);

      for (let i = 0; i < result.length; i++) {
        result[i] = result[i].item;
      }

      console.log(result);

      return result;
    },
    // onChange: function (e) {
    //   if (this.handleChange) {
    //     this.handleChange(e);
    //   } else {
    //     this.$emit("update:value", e.target.value);
    //   }
    // },
  },

  mounted: function () {
    this.selector = ".bzz";
  },
};
</script>

<style lang="scss">
.c-input-timezone {
  &__popup {
    position: relative;

    width: 320px;
    height: 330px;
    background-color: var(--color-bg-4);
    border-radius: var(--border-radius);
  }

  .form-control {
    padding-top: 6px;
  }

  &__list {
    position: absolute;
    top: 66px;
    left: 0;
    width: 100%;
    height: 264px;
    overflow-y: auto;
    padding: 0 14px;

    > span {
      display: block;
      padding: var(--margin);
      border-radius: var(--border-radius);
      user-select: none;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover,
      &:active {
        background-color: var(--color-bg-5);
      }
    }
  }

  &__search {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 14px;
    background-color: var(--color-bg-4);
    border-radius: var(--border-radius);

    .form-control {
      margin-bottom: 0;
    }
  }
}
</style>
