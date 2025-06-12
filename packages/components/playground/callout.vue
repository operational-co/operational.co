<template>
  <div class="c-playground-callout">
    <div class="btn-switch">
      <button
        @click.prevent="updateView('view')"
        type="button"
        :class="['btn', { 'btn-muted': currentView === 'view' }]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 15H11M15 15H17M7 11H8M12 11H17M4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        @click.prevent="updateView('code')"
        type="button"
        :class="['btn', { 'btn-muted': currentView === 'code' }]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.2424 3.02985C14.7782 3.1638 15.1039 3.70673 14.97 4.24253L10.97 20.2426C10.836 20.7784 10.2931 21.1041 9.75731 20.9702C9.22152 20.8362 8.89576 20.2933 9.02971 19.7575L13.0297 3.75746C13.1637 3.22166 13.7066 2.8959 14.2424 3.02985ZM6.70696 7.29293C7.09748 7.68345 7.09748 8.31662 6.70696 8.70714L3.41406 12L6.70696 15.2929C7.09748 15.6834 7.09748 16.3166 6.70696 16.7071C6.31643 17.0977 5.68327 17.0977 5.29274 16.7071L1.99985 13.4142C1.2188 12.6332 1.2188 11.3669 1.99985 10.5858L5.29274 7.29293C5.68327 6.9024 6.31643 6.9024 6.70696 7.29293ZM17.2927 7.29293C17.6833 6.9024 18.3164 6.9024 18.707 7.29293L21.9998 10.5858C22.7809 11.3669 22.7809 12.6332 21.9998 13.4142L18.707 16.7071C18.3164 17.0977 17.6833 17.0977 17.2927 16.7071C16.9022 16.3166 16.9022 15.6834 17.2927 15.2929L20.5856 12L17.2927 8.70714C16.9022 8.31662 16.9022 7.68345 17.2927 7.29293Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <button @click="onCopy" type="button" class="btn btn-wide btn-primary">{{ copyText }}</button>

    <button @click="onSend" type="button" class="btn btn-wide btn-primary">
      <span v-if="sendText === 'Sending'" class="c-spinner"></span>
      <span>
        {{ sendText }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  components: {},

  data: function () {
    return {
      sendText: "Send event",

      copyText: "Copy code",
      copyTimeout: null
    };
  },

  props: {
    context: {},
    example: {},
    active: {
      type: Boolean,
      default: false
    },
    currentView: {},
    currentCode: {}
  },

  watch: {},

  methods: {
    updateView: function (view) {
      this.$emit("update:currentView", view);
    },
    async onSend() {
      try {
        this.sendText = "Sending";
        const res = await this.sendEvent();

        this.sendText = "Send event";
      } catch (err) {
        console.log(err);
        console.error("Failed to send:", err);
      }
    },
    async onCopy() {
      try {
        await navigator.clipboard.writeText(this.currentCode);
        this.copyText = "Copied!";

        // Clear any existing timeout before setting a new one
        if (this.copyTimeout) clearTimeout(this.copyTimeout);

        this.copyTimeout = setTimeout(() => {
          this.copyText = "Copy code";
          this.copyTimeout = null;
        }, 1000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },

    async sendEvent() {
      let event = JSON.parse(JSON.stringify(this.example.item));
      event.notify = this.context.notify || false;
      event.test = this.context.test || false;

      await this.$store.events.sendEvent(event, this.context.token);

      let text = "Event sent!";
      if (event.test) {
        text = "Test event sent!";
      }
      this.$store.app.sendNotification({
        message: text,
        timer: 1000
      });
    }
  }
};
</script>

<style lang="scss">
.c-playground-callout {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: hsla(var(--hue-p), 16%, 16%, 0.25);
  backdrop-filter: blur(3px);

  display: flex;
  align-items: center;

  padding: 1rem;
  border-radius: calc(1rem + var(--input-radius));

  .btn {
    svg {
      min-width: 24px;
    }
  }

  .btn-primary {
    margin-left: 1rem;
    white-space: pre;
  }

  @media screen and (max-width: 576px) {
    left: 0;
    bottom: 0;
    width: 100%;
    transform: translateX(0);
    padding: 0.5rem;
    border-radius: var(--input-radius);

    flex-wrap: wrap;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    .btn-switch {
      width: 100%;
    }

    .btn-primary {
      margin-top: 0.5rem;
      margin-left: 0;
    }
  }
}
</style>
