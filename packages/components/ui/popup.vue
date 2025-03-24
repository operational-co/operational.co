<template>
  <div :class="['c-popup', klass, { active: active === true }]" :style="style" ref="tooltip">
    <span class="c-arrow" :style="arrowStyle">
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.99976 4.00066C3.99976 12.0003 -0.000244141 12.0005 -0.000244141 12.0005L23.9998 11.9993C23.9998 11.9993 19.9998 11.9995 15.9998 3.99949L15.9994 3.99887C14.9996 2.00012 13.9996 0.0011664 11.9998 0.000732422C9.99976 0.000760649 8.99976 2.00068 7.99986 4.00056L7.99976 4.00066Z"
          fill="currentColor"
        ></path>
      </svg>
    </span>
    <slot></slot>
  </div>
</template>

<script>
import { computePosition, flip, shift, arrow, offset, autoUpdate } from "@floating-ui/dom";

export default {
  data: function () {
    return {
      x: 0,
      y: 0,
      arrowX: 0,
      arrowY: 0,
      placement: null,
      middlewareData: null
    };
  },

  props: {
    klass: {
      type: String,
      default: ""
    },
    selector: {},
    active: {
      type: Boolean,
      default: false
    },
    xMargin: {
      type: Number,
      default: 0
    },
    yMargin: {
      type: Number,
      default: 0
    }
  },

  watch: {
    active: function () {
      if (!this.active) {
        this.cleanup();
      }
    }
  },

  computed: {
    style: function () {
      let x = this.x + this.xMargin;
      let y = this.y + this.yMargin;
      const obj = {
        left: `${x}px`,
        top: `${y}px`
      };
      return obj;
    },
    arrowStyle: function () {
      let middlewareData = this.middlewareData;
      let placement = this.placement;

      if (!middlewareData) {
        return {};
      }

      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      }[placement.split("-")[0]];

      let style = {
        left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : "",
        top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : "",
        [staticSide]: "-4px"
      };

      return style;
    }
  },

  methods: {
    update: async function () {
      let button = null;
      if (typeof this.selector === "string") {
        button = document.querySelector(this.selector);
      } else {
        button = this.selector;
      }
      const tooltip = this.$refs.tooltip;
      const arrowElement = document.querySelector(".c-arrow");
      const options = {
        middleware: [offset(16), flip(), shift({ padding: 5 }), arrow({ element: arrowElement })]
      };
      const { x, y, placement, middlewareData } = await computePosition(button, tooltip, options);

      this.x = x;
      this.y = y;

      this.placement = placement;
      this.middlewareData = middlewareData;
    },
    cleanup: function () {
      //       autoUpdate(
      //   referenceEl,
      //   floatingEl,
      //   updatePosition,
      // );

      this.$emit("onClose");
    },
    onMouseDown: function (e) {
      if (e.target.closest(this.selector)) {
        return;
      }

      if (e.target.closest(".c-popup")) {
        return;
      }

      this.$emit("onClose");
    },
    addEventListeners: function () {
      window.addEventListener("mousedown", this.onMouseDown);
      window.addEventListener("touchstart", this.onMouseDown);
    },
    removeEventListeners: function () {
      window.removeEventListener("mousedown", this.onMouseDown);
      window.removeEventListener("touchstart", this.onMouseDown);
    }
  },

  mounted: async function () {
    this.update();
    this.addEventListeners();
  },

  beforeDestroy: function () {
    this.removeEventListeners();
  }
};
</script>

<style lang="scss">
.c-popup {
  width: max-content;
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  background-color: var(--color-bg-3);

  border-radius: var(--border-radius);

  opacity: 0;
  pointer-events: none;

  transition: all var(--transition-time-sm) cubic-bezier(0.215, 0.61, 0.355, 1);

  box-shadow: rgb(0, 0, 0) 0px 20px 20px -10px;

  p {
    margin-bottom: 0;
  }

  .c-arrow {
    position: absolute;
    display: inline-flex;
    width: 24px;
    height: 12px;
    transform: translateY(calc(-50% - 2px));
    color: var(--color-bg-4);
    //background-color: red;

    > svg {
      height: 100%;
    }
  }

  &.active {
    opacity: 1;
    pointer-events: initial;
  }
}
</style>
