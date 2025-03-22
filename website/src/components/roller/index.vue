<template>
  <div class="c-roller">
    <transition-group name="fade" tag="section">
      <Alert v-for="item in stack" :key="item.id" :item="item" @onClose="onClose(item)"></Alert>
    </transition-group>
  </div>
</template>

<script>
import Alert from "./alert.vue";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    Alert
  },

  data: function () {
    return {
      limit: 6,
      stack: []
    };
  },

  props: {
    item: {}
  },

  watch: {},

  computed: {},

  methods: {
    showItem(item) {
      item.timer = item.timer || 6000;
      item.status = item.status || ""; //success, warning, ''
      this.addToStack(item);
    },
    onClose: function (item) {
      this.removeFromStack(item.id);
    },
    removeFromStack: function (id) {
      let index = -1;
      let items = this.stack;

      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
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
        id: uuidv4()
      };
      this.stack.unshift(message);

      if (this.stack.length === this.limit) {
        this.stack.pop();
      }
    },
    clear: function () {
      this.stack = [];
    }
  },

  created: function () {
    const store = this.$store;

    this.$watch(
      "item", // Watch the 'item' prop deeply
      {
        handler: function (newValue, oldValue) {
          if (!newValue) {
            return;
          }
          newValue = JSON.parse(JSON.stringify(newValue));
          newValue.id = nanoid();
          this.showItem(newValue);
        },
        deep: true // Watch deeply for changes
      }
    );
  },

  mounted: function () {
    // this.addToStack({
    //   message: "test",
    //   timer: 100000,
    // });
  }
};
</script>

<style lang="scss">
.c-roller {
  margin: 0 auto;
  width: 500px;
  height: calc(256px + 64px);
  overflow-y: hidden;

  padding: var(--margin-lg) var(--spacer);

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
    height: calc(200px + 64px);
    left: 0;
    width: 100%;
    padding: var(--margin-lg);
  }
}
</style>
