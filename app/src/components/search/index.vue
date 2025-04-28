<template>
  <div class="c-search">
    <div :class="['c-search__wrap', 'search-selector']">
      <InputText
        placeholder="Search for events"
        :value="text"
        @update:value="onUpdate"
        @focus:event="onFocus"
        @enter:event="onEnter"
      >
        <template v-slot:pre-input>
          <!-- <Icon></Icon> -->
          <svg
            class="icon-search"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 20L16.05 16.05M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </template>
        <template v-slot:post-input>
          <svg
            v-if="text || currentCategory"
            @click="onClear"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.18934 4.18934C4.77513 3.60355 5.72487 3.60355 6.31066 4.18934L12 9.87868L17.6893 4.18934C18.2751 3.60355 19.2249 3.60355 19.8107 4.18934C20.3964 4.77513 20.3964 5.72487 19.8107 6.31066L14.1213 12L19.8107 17.6893C20.3964 18.2751 20.3964 19.2249 19.8107 19.8107C19.2249 20.3964 18.2751 20.3964 17.6893 19.8107L12 14.1213L6.31066 19.8107C5.72487 20.3964 4.77513 20.3964 4.18934 19.8107C3.60355 19.2249 3.60355 18.2751 4.18934 17.6893L9.87868 12L4.18934 6.31066C3.60355 5.72487 3.60355 4.77513 4.18934 4.18934Z"
              fill="currentColor"
            />
          </svg>

          <!-- <Icon name="cross" v-if="text" @click="onClear"></Icon> -->
        </template>
      </InputText>
      <CategoryButton
        @onCategorySelected="onCategorySelected"
        :categories="categories"
        :category="currentCategory"
      ></CategoryButton>
    </div>

    <Popup
      v-if="selector"
      :selector="selector"
      :active="popupActive"
      @onClose="onPopupClose"
      :yMargin="-10"
    >
      <div class="c-search__dropdown">
        <div class="c-search__dropdown__list">
          <a href="#" v-for="(name, i) in eventNames" :key="i" @click.prevent="addToSearch(name)">
            {{ name }}
          </a>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import InputText from "@operational.co/components/form/input-text.vue";
import Icon from "@operational.co/components/ui/icon.vue";
import debounce from "lodash/debounce";
import Popup from "@operational.co/components/ui/popup.vue";
import CategoryButton from "./category-button.vue";

export default {
  components: {
    InputText,
    Icon,
    Popup,
    CategoryButton,
  },

  data: function () {
    return {
      items: [
        {
          value: 1,
          label: "shashwat.amin@yahoo.com",
          searchText: "shashwat.amin@yahoo.com",
        },
        {
          value: 2,
          label: "shash122tfu@gmail.com",
          searchText: "shash122tfu@gmail.com",
        },
      ],
      text: "",
      debouncedValue: "",
      debounceTime: 750,

      currentCategory: null,

      selector: null,

      popupActive: false,
    };
  },

  // not used atm
  props: {
    value: {
      type: String,
    },
  },

  watch: {
    debouncedValue: function () {
      let val = this.text;
      this.$emit("update:value", val);
    },
  },

  computed: {
    categories: function () {
      if (!this.workspace) {
        return [];
      }
      let categories = this.workspace.categories || [];
      return categories;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    eventNames: function () {
      if (this.workspace && this.workspace.eventNames) {
        return this.workspace.eventNames;
      } else {
        return [];
      }
    },
    loading: function () {
      return this.$store.app.loading;
    },
    isSwitchDisabled: function () {
      if (this.loading) {
        return true;
      }
      return false;
    },
  },

  methods: {
    onCategorySelected: function (category) {
      this.currentCategory = category;
      this.$emit("onCategorySelected", category.text);
    },
    setValue: function (val) {
      this.addToSearch(val);
    },
    onFocus: function (e) {
      this.showPopup();
    },
    addToSearch: function (name) {
      name = `"${name}"`;
      this.onUpdate(name);
      this.onPopupClose();
    },
    showPopup: function () {
      if (this.eventNames.length > 0) {
        this.popupActive = true;
      }
    },
    onPopupClose: function () {
      this.popupActive = false;
    },
    onOpen(key) {
      //this.items = key === "@" ? users : issues;
    },
    onUpdate: function (e) {
      this.text = e;
      this.debouncedUpdate();
    },
    updateValue() {
      this.debouncedValue = this.text;
    },
    onClear: function () {
      this.text = "";
      this.currentCategory = null;
      this.$emit("onClear");
    },
    onEnter: function () {
      this.popupActive = false;
    },
  },

  created: function () {
    this.debouncedUpdate = debounce(this.updateValue, this.debounceTime);
  },

  mounted: function () {
    this.selector = ".search-selector .c-input-text";
  },
};
</script>

<style lang="scss">
.c-search {
  padding-top: var(--margin-lg);
  width: 100%;
  position: relative;
  top: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;

  &__wrap {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 200px;
    grid-column-gap: 0.5rem;

    .c-switch {
      position: absolute;
      top: 4px;
      right: 4px;
      height: 30px;
    }
  }

  .c-input-text {
    border-radius: var(--input-radius);
    box-shadow:
      0px 2.1px 5.3px rgba(0, 0, 0, 0.073),
      0px 7.1px 17.9px rgba(0, 0, 0, 0.107),
      0px 32px 80px rgba(0, 0, 0, 0.18);
  }

  &__filters {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .c-input-text svg {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 8px;
    height: 100%;
    opacity: 0.8;
  }

  .form-control-wrap {
    position: relative;
  }

  .form-control {
    margin-bottom: 0;

    border-color: transparent;
    //background-color: hsla(var(--hue-p), 3%, 11%, 0.35);

    background-color: var(--color-bg-2);

    backdrop-filter: blur(4px);

    padding-left: 38px;
    padding-right: 38px;
  }

  .form-control + svg {
    left: auto;
    right: 8px;

    cursor: pointer;
  }

  .c-popup {
    width: 100%;
    .c-arrow {
      display: none;
    }
  }

  &__dropdown {
    width: 100%;
    height: 360px;
    position: relative;

    &__list {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: hsl(var(--hue-p), 6%, 18%);
        border-radius: 0;
        border-radius: 5px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--hue-p), 6%, 18%);
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    a {
      display: block;
      padding: var(--margin);
      color: var(--color-font);
      border-radius: var(--border-radius);

      &:hover,
      &:active {
        background-color: var(--color-bg-5);
      }
    }
  }

  &__categories {
    position: relative;
    display: flex;
    padding-top: var(--margin);
    width: 100%;
    overflow: hidden; /* Prevent overflow of the gradient */

    &:after {
      content: "";
      position: absolute;
      top: var(--margin);
      right: -1px;
      width: 50px;
      height: calc(100% - var(--margin));
      background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--color-bg-1) 80%);

      pointer-events: none;

      z-index: 10;
    }

    &__wrap {
      position: relative;
      display: flex;
      width: 100%;
      padding-bottom: var(--margin-sm);
      overflow-x: auto; /* Enable horizontal scrolling for the inner content */

      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: hsl(var(--hue-p), 6%, 18%);
        border-radius: 0;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--hue-p), 6%, 18%);
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    &__inner {
      display: flex;
      width: max-content;
    }

    a {
      display: inline-flex;
      min-height: 32px;
      align-items: center;
      margin-right: var(--margin);
      padding: var(--margin) var(--margin-lg);
      border-radius: var(--border-radius-full);
      background-color: var(--color-bg-3);
      color: var(--color-font);
      font-size: var(--font-size-sm);
      line-height: 1.1;
      font-weight: 500;
      white-space: nowrap;

      transition: all var(--transition-time) linear;

      svg {
        display: inline-block;
        min-width: 20px;
        margin-left: 4px;
      }

      &:last-child {
        margin-right: 0;
      }

      &:hover,
      &:active {
        color: var(--color-primary);
        background-color: var(--color-primary-dark);
      }

      &.active {
        color: var(--color-primary);
        background-color: var(--color-primary-dark);
      }
    }
  }

  @media screen and (max-width: 576px) {
    &__dropdown {
      height: 198px;
      &__list {
        font-size: var(--font-size-sm);
      }
    }

    &__wrap {
      grid-template-columns: 1fr 140px;
    }
  }
}
</style>
