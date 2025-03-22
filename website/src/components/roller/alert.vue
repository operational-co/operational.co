<template>
  <div :class="['c-roller-alert', item.status]" @click="onClick">
    <svg
      v-if="item.status === 'failure'"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM8.53033 7.46967C8.23744 7.17678 7.76256 7.17678 7.46967 7.46967C7.17678 7.76256 7.17678 8.23744 7.46967 8.53033L10.9393 12L7.46967 15.4697C7.17678 15.7626 7.17678 16.2374 7.46967 16.5303C7.76256 16.8232 8.23744 16.8232 8.53033 16.5303L12 13.0607L15.4697 16.5303C15.7626 16.8232 16.2374 16.8232 16.5303 16.5303C16.8232 16.2374 16.8232 15.7626 16.5303 15.4697L13.0607 12L16.5303 8.53033C16.8232 8.23744 16.8232 7.76256 16.5303 7.46967C16.2374 7.17678 15.7626 7.17678 15.4697 7.46967L12 10.9393L8.53033 7.46967Z"
        fill="currentColor"
      />
    </svg>

    <Item :item="item"></Item>
  </div>
</template>

<script>
//import anime from "animejs";
import Item from "@operational.co/components/card/index.vue";

export default {
  components: {
    Item
  },

  props: {
    item: {
      type: Object,
      default: null,
      animation: null
    }
  },

  watch: {
    item: {
      handler: function () {
        this.startTimer();
      },
      immediate: true
    }
  },

  methods: {
    animate: function () {
      //let el = this.$refs.glitter;
      let opacity = [0, 1, 0.75, 0.5, 0.25, 0];
      let easing = "linear";
      let duration = 1000;
      let delay = 750;

      // this.animation = anime({
      //   targets: el,
      //   easing: easing,
      //   duration: duration,
      //   opacity: opacity,
      //   delay: delay,
      //   translateX: [0, -6],
      //   translateY: [0, -6],
      //   //opacity: opacity,
      // });
    },
    onClick: function () {
      //this.close();
    },
    close: function () {
      this.$emit("onClose");
    },
    startTimer: function () {
      if (!this.item.timer) {
        return;
      }
      setTimeout(() => {
        this.close();
      }, this.item.timer);
    }
  },

  mounted: function () {
    if (this.item.status === "success") {
      this.animate();
    }
  }
};
</script>

<style lang="scss">
.c-roller-alert {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  transition: all var(--transition-time) linear;

  pointer-events: all;
  user-select: none;

  cursor: pointer;

  .c-card {
    width: 100%;
    margin-bottom: 1rem;
    filter: brightness(125%);

    box-shadow:
      0px 1px 2px rgba(3, 7, 18, 0.15),
      0px 4px 10px rgba(3, 7, 18, 0.31),
      0px 8px 22px rgba(3, 7, 18, 0.46);
  }

  @media screen and (max-width: 576px) {
    .c-card {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
