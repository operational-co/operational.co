<template>
  <div class="c-category-button btn category-button-selector" @click="onClick">
    <span :class="[{ muted: !category }]">{{ category ? category.text : "Category" }}</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 9L12.7071 16.2929C12.3166 16.6834 11.6834 16.6834 11.2929 16.2929L4 9"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
  <Popup
    v-if="selector"
    :selector="selector"
    :active="popupActive"
    @onClose="onPopupClose"
    :xMargin="0"
    :yMargin="-10"
    placement="bottom-end"
  >
    <div class="c-category-button__dropdown">
      <div class="c-category-button__dropdown__list" v-if="categories.length > 0">
        <a
          :class="[{ active: category && cat.text === category.text }]"
          href="#"
          v-for="(cat, i) in categories"
          :key="i"
          @click.prevent="filterCategory(cat)"
        >
          {{ cat.text }}
        </a>
      </div>
      <div v-else class="c-category-button__dropdown__empty">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 11H12V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8C12.75 8.41421 12.4142 8.75 12 8.75C11.5858 8.75 11.25 8.41421 11.25 8C11.25 7.58579 11.5858 7.25 12 7.25Z"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="0.5"
          />
        </svg>
        <p>No categories found.</p>
        <p>To add categories, pass <code>category: yourcategory</code> inside events.</p>
      </div>
    </div>
  </Popup>
</template>

<script>
import InputText from "@operational.co/components/form/input-text.vue";
import Icon from "@operational.co/components/ui/icon.vue";
import debounce from "lodash/debounce";
import Popup from "@operational.co/components/ui/popup.vue";

export default {
  components: {
    InputText,
    Icon,
    Popup,
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

      selector: null,

      popupActive: false,
    };
  },

  emits: ["onCategorySelected"],

  // not used atm
  props: {
    value: {
      type: String,
    },
    categories: {
      default: function () {
        return [];
      },
    },
    category: {},
  },

  watch: {},

  computed: {
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
    filterCategory: function (cat) {
      this.$emit("onCategorySelected", cat);
      this.popupActive = false;
    },
    onClick: function (e) {
      if (!this.popupActive) {
        this.popupActive = true;
      } else {
        this.popupActive = false;
      }
    },
    showPopup: function () {
      if (this.eventNames.length > 0) {
        this.popupActive = true;
      }
    },
    onPopupClose: function () {
      this.popupActive = false;
    },
  },

  mounted: function () {
    this.selector = ".category-button-selector";
  },
};
</script>

<style lang="scss">
.c-category-button {
  position: relative;
  padding: 6px;
  padding-left: 12px;
  display: grid;
  grid-template-columns: 1fr 24px;

  span {
    font-size: var(--font-size-sm);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &.muted {
      opacity: 0.65;
    }
  }

  &__dropdown {
    //width: 100%;
    height: 194px;
    position: relative;

    &__empty {
      padding: 1rem;
      text-align: center;
      width: 100%;

      svg {
        display: inline-block;
      }

      p {
        display: block;
      }
    }

    &__list {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: var(--margin);

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

      &.active {
        background-color: var(--color-primary);
      }
    }
  }
}
</style>
