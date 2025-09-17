<template>
  <div :class="['c-message-alert', message.status]" @click="onClick">
    <svg
      v-if="message.status === 'failure'"
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
    <template v-if="message.html">
      <article v-html="message.html"></article>
    </template>
    <template v-else>
      <p>{{ message.message }}</p>
    </template>
    <div class="c-glitter" ref="glitter">
      <svg
        width="68"
        height="74"
        viewBox="0 0 68 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        b
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.4259 68.5278C16.0259 66.7318 9.32534 65.8258 2.82534 64.9958C1.42534 64.8218 0.125535 65.7928 0.0255346 67.1608C-0.174465 68.5298 0.826121 69.7818 2.12612 69.9557C8.42612 70.7548 14.9255 71.6097 21.0255 73.3387C22.3255 73.7137 23.7261 72.9418 24.1261 71.6138C24.5261 70.2868 23.7259 68.9038 22.4259 68.5278Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M41.8251 43.0648C31.5251 32.5538 19.9251 23.3958 9.8251 12.6028C8.9251 11.5948 7.3251 11.5408 6.3251 12.4818C5.3251 13.4238 5.22549 15.0078 6.22549 16.0158C16.3255 26.8398 27.9255 36.0278 38.2255 46.5698C39.2255 47.5538 40.8251 47.5678 41.8251 46.5998C42.7251 45.6328 42.8251 44.0488 41.8251 43.0648Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M61.1264 2.63576C61.4264 8.65176 61.7259 14.6678 62.0259 20.6848C62.0259 22.0628 63.2264 23.1268 64.6264 23.0598C66.0264 22.9918 67.0259 21.8188 67.0259 20.4398C66.7259 14.4138 66.4264 8.38876 66.1264 2.36376C66.0264 0.985757 64.8262 -0.0712432 63.4262 0.00375683C62.1262 0.0787568 61.0264 1.25876 61.1264 2.63576Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
</template>

<script>
//import anime from "animejs";

export default {
  props: {
    message: {
      type: Object,
      default: null,
      animation: null,
    },
  },

  watch: {
    message: {
      handler: function () {
        this.startTimer();
      },
      immediate: true,
    },
  },

  methods: {
    animate: function () {
      let el = this.$refs.glitter;
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
      this.close();
    },
    close: function () {
      this.$emit("onClose");
    },
    startTimer: function () {
      if (!this.message.timer) {
        return;
      }
      setTimeout(() => {
        this.close();
      }, this.message.timer);
    },
  },

  mounted: function () {
    if (this.message.status === "success") {
      this.animate();
    }
  },
};
</script>

<style lang="scss">
.c-message-alert {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: var(--color-bg-5);
  text-align: center;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  border-radius: 10px;
  margin-bottom: 8px;
  padding: 8px;
  transition: all var(--transition-time) linear;

  pointer-events: all;
  user-select: none;

  cursor: pointer;

  > svg {
    position: absolute;
    top: calc(50% - 12px);
    left: 10px;
    color: var(--color-danger);
  }

  > p {
    margin-bottom: 0;
  }

  &:hover,
  &:active {
    box-shadow: 0 0 0 2px var(--g2);
    background-color: var(--color-bg-6);
  }

  .c-glitter {
    position: absolute;
    top: -20px;
    left: -20px;
    width: 30px;
    opacity: 0;
    pointer-events: none;
    color: var(--color-primary);

    svg {
      width: 100%;
      height: 100%;
    }
  }

  article {
    text-align: left;
    font-size: var(--font-size-sm);

    p {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
