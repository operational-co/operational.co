<template>
  <VueFinalModal
    :class="[klass, { full: type === 'full' }, { 'full-edge': type === 'full-edge' }]"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    :clickToClose="closeable"
    :escToClose="closeable"
    :content-transition="contentTransition"
    v-model="modalActive"
    @beforeClose="onClose"
  >
    <slot></slot>
    <ModalClose v-if="closeable" @onClick="onClose"></ModalClose>
  </VueFinalModal>
</template>

<script>
import ModalClose from "./modal-close.vue";
import { VueFinalModal } from "vue-final-modal";

export default {
  components: {
    ModalClose,
    VueFinalModal
  },

  data: function () {
    return {
      modalActive: false,
      title: "Test modal"
    };
  },

  watch: {
    active: {
      handler: function () {
        this.modalActive = this.active;
      },
      immediate: true
    }
  },

  props: {
    klass: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    active: {
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    contentTransition: function () {
      if (this.type === "full") {
        return "abrupt-fade";
      }
      if (this.type === "full-edge") {
        return `abrupt-fade`;
      }
      return `slide-fade`;
      if (this.type === "full") {
        return "fade-enter";
      }

      return "fade-enter";
    }
  },

  methods: {
    onClose: function () {
      this.$emit("onClose");
    }
  }
};
</script>

<style lang="scss">
.vfm {
  display: flex;
  align-items: center;
  justify-content: center;

  .vfm--overlay {
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
  }

  .vfm__content {
    position: relative;
    width: 720px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--color-bg-3);
    border-radius: 10px;
    box-shadow: rgb(0, 0, 0) 0px 20px 30px -10px;
  }

  &.full {
    .vfm__content {
      width: 100%;
      height: 100%;
      background-color: var(--color-bg-1);
      border-radius: 0;
    }
    .c-modal-close {
      display: none;
    }
  }

  &.full-edge {
    .vfm__content {
      padding: 0;
      width: 100%;
      top: 128px;
      height: calc(100% - 128px);
      position: absolute;
      overflow-y: auto;
      background-color: var(--color-bg-1);
      border-radius: 0;
      border-top: var(--color-bg-3) solid 1px;

      &::-webkit-scrollbar {
        width: 10px;
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
    .c-modal-close {
      display: none;
    }
  }

  .slide-fade-enter-active {
    transition: all 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .slide-fade-leave-active {
    transition: all var(--transition-time) linear;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(8px) scale(0.95);
    opacity: 0;
  }

  .abrupt-fade-enter-active {
    transition: all 0ms cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .abrupt-fade-leave-active {
    transition: all var(--transition-time) linear;
  }

  .abrupt-fade-enter-from,
  .abrupt-fade-leave-to {
    transform: scale(0.95);
    opacity: 0;
  }

  @media screen and (max-width: 576px) {
    padding: 0 var(--margin-lg);

    &.full {
      padding: 0;
    }

    &.full-edge {
      padding: 0;

      .vfm__content {
        width: 100%;
        top: 80px;
        height: calc(100% - 80px);
      }
    }
  }
}
</style>
