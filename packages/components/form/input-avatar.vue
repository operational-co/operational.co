<template>
  <div :class="['c-input-avatar', { overlay: isOverlayVisible === true }]" @drop.prevent="onDrop">
    <label class="form-label" v-if="label" :for="name">{{ label }}</label>
    <div class="form-control-wrap">
      <slot name="pre-input"></slot>
      <div class="c-input-avatar__inner">
        <div class="c-input-avatar__img">
          <img v-if="currentImagePath" :src="currentImagePath" />
        </div>
        <input type="file" :class="['form-control']" @input="onChange" />
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
      tempImagePath: "",
      isOverlayVisible: false
    };
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
    currentImagePath: function () {
      if (this.tempImagePath) {
        return this.tempImagePath;
      }
      if (this.value) {
        return `${this.assetPath}/${this.value}`;
      }
      return null;
    },
    assetPath: function () {
      let baseUrl = "http://localhost:2000";

      if (import.meta && import.meta.env.VITE_API_URL) {
        baseUrl = import.meta.env.VITE_API_URL;
      }
      return `${baseUrl}/uploads/`;
    }
  },

  methods: {
    onChange: function (e) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      this.handleFile(file);
    },
    handleFile: function (file) {
      if (this.handleChange) {
        this.handleChange(file);
      } else {
        this.$emit("update:value", file);
      }
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result;
        this.tempImagePath = imageDataUrl;
        //this.$emit("update:value", file); // Emitting the base64 string to parent component
      };
      reader.readAsDataURL(file);
    },
    onDragOver() {
      this.isOverlayVisible = true; // Show overlay on drag over
    },

    onDragLeave() {
      this.isOverlayVisible = false; // Hide overlay on drag leave
    },

    onDrop(e) {
      const file = e.dataTransfer.files[0];
      this.isOverlayVisible = false; // Hide overlay on drop
      if (!file) {
        return;
      }

      this.handleFile(file);
    },

    setupGlobalDragEvents() {
      window.addEventListener("dragover", this.onDragOver);
      window.addEventListener("dragleave", this.onDragLeave);
      window.addEventListener("dragend", this.onDragLeave); // Hide overlay when drag ends
    },

    cleanupGlobalDragEvents() {
      window.removeEventListener("dragover", this.onDragOver);
      window.removeEventListener("dragleave", this.onDragLeave);
      window.removeEventListener("dragend", this.onDragLeave);
    }
  },

  mounted: function () {
    this.setupGlobalDragEvents();
  },

  beforeDestroy: function () {
    this.cleanupGlobalDragEvents();
  }
};
</script>

<style lang="scss">
.c-input-avatar {
  position: relative;

  &:after {
    content: "Drop file here";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.15);
    border: rgba(255, 255, 255, 0.3) dashed 4px;
    pointer-events: none;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
  }

  &.overlay {
    &:after {
      opacity: 1;
    }
  }

  &__inner {
    display: grid;
    grid-template-columns: 48px 1fr;

    input {
      width: calc(100% - var(--margin-lg));
      height: 100%;
      margin-left: var(--margin-lg);
    }
  }

  &__img {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius);
    background-color: var(--color-bg-4);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
}
</style>
