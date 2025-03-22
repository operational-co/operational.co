<template>
  <div class="c-message">
    <transition-group name="fade" tag="section">
      <Alert
        v-for="message in stack"
        :key="message.id"
        :message="message"
        @onClose="onClose(message)"
      ></Alert>
    </transition-group>
  </div>
</template>

<script>
import Alert from "./alert.vue";

import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    Alert,
  },

  data: function () {
    return {
      limit: 6,
      stack: [],
    };
  },

  watch: {},

  computed: {},

  methods: {
    showMessage(message) {
      message.timer = message.timer || 4000;
      message.status = message.status || ""; //success, warning, ''
      this.addToStack(message);
    },
    onClose: function (message) {
      this.removeFromStack(message.id);
    },
    removeFromStack: function (id) {
      let index = -1;
      let messages = this.stack;

      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id === id) {
          index = i;
          break;
        }
      }

      if (index === -1) {
        return;
      }

      this.stack.splice(index, 1);
    },
    addToStack: function (message) {
      //this.$store.dispatch("sounds/play", "onMessage");
      message = {
        ...message,
        id: uuidv4(),
      };
      this.stack.unshift(message);

      if (this.stack.length === this.limit) {
        this.stack.pop();
      }
    },
  },

  created: function () {
    const store = this.$store;

    this.$watch(
      () => store.app.notification,
      (newValue, oldValue) => {
        this.showMessage(newValue);
        this.myStateProperty = newValue; // Update the component's data property
        // You can perform any actions you want with the new and old values here
      },
    );
  },

  mounted: function () {
    // this.addToStack({
    //   message: "test",
    //   timer: 100000,
    // });
  },
};
</script>

<style lang="scss">
.c-message {
  position: fixed;
  z-index: 1050;
  bottom: 0;
  left: calc(50% - 150px);
  width: 300px;

  padding: var(--margin-lg) 0;

  pointer-events: none;

  > section {
    width: 100%;
    position: relative;
  }

  /* 1. declare transition */
  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 500ms cubic-bezier(0.55, 0, 0.1, 1);
  }

  /* 2. declare enter from and leave to state */
  .fade-enter-from {
    opacity: 0;
    transform: translate(0, -8px);
  }

  .fade-leave-to {
    opacity: 0;
    transform: translate(0, 8px);
  }

  /* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
  .fade-leave-active {
    position: absolute;
  }

  @media screen and (max-width: 576px) {
    left: 0;
    width: 100%;
    padding: var(--margin-lg);
  }
}
</style>
