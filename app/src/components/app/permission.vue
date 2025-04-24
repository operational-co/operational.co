<template>
  <div class="c-app-permission">
    <section>
      <p v-if="isServiceWorkerRegistered">
        <strong>
          <span class="c-app-permission__label">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
                fill="currentColor"
              />
            </svg> </span
          >Service worker is registered.
        </strong>
      </p>
      <p v-else>
        <strong>
          Service worker isn't registered. If you're on mobile iOS or Android, you won't receive
          push notifications.</strong
        >
        <a href="https://operational.co/manual/pwa" target="_blank">What is PWA mode?</a>
      </p>
      <p>{{ titleText }}</p>
    </section>

    <section>
      <strong>
        <span
          :class="[
            'c-app-permission__label',
            { failure: status === 'denied' },
            { warning: status === 'default' },
          ]"
        >
          <svg
            v-if="status === 'default'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16 12.9999C16.5523 12.9999 17 12.5522 17 11.9999C17 11.4476 16.5523 10.9999 16 10.9999L7.99997 11.0001C7.44769 11.0001 6.99998 11.4479 7 12.0001C7.00002 12.5524 7.44774 13.0001 8.00003 13.0001L16 12.9999Z"
              fill="currentColor"
            />
          </svg>

          <svg
            v-if="status === 'granted'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
              fill="currentColor"
            />
          </svg>
          <svg
            v-if="status === 'denied'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z"
              fill="currentColor"
            />
          </svg>
        </span>
        Device status
      </strong>
      <div class="c-app-permission__status">
        <!-- <span :class="[status]"></span> -->
        <p>{{ statusText }}</p>
      </div>
      <button @click="sendTestPushNotification" class="btn btn-sm" type="button">
        <span v-if="pushNotificationProcessing" class="c-spinner"></span>
        Send test push notification
      </button>
      <div class="c-app-permission__error">
        <span v-if="pushNotificationError">
          {{ pushNotificationError }}
        </span>
      </div>
      <!-- <a href="#" v-if="status !== 'granted'">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 16V11M12.5 8C12.5 8.27614 12.2761 8.5 12 8.5C11.7239 8.5 11.5 8.27614 11.5 8M12.5 8C12.5 7.72386 12.2761 7.5 12 7.5C11.7239 7.5 11.5 7.72386 11.5 8M12.5 8H11.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        Instructions for enabling push notifications for this device.
      </a> -->
      <button
        v-if="status !== 'granted'"
        type="button"
        class="btn btn-primary btn-sm"
        @click="enablePush"
      >
        Allow push notifications
      </button>
    </section>
    <section>
      <strong>
        <span :class="['c-app-permission__label', { failure: !isNotify }]">
          <svg
            v-if="isNotify"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
              fill="currentColor"
            />
          </svg>
          <svg
            v-else
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z"
              fill="currentColor"
            />
          </svg>
        </span>
        Account level push notifications
      </strong>
      <p>
        {{ settingsText }}
      </p>
      <div class="c-notify">
        <label class="c-switch">
          <input v-model="notify" type="checkbox" checked />
          <span class="c-switch__slider">
            <span class="c-switch__toggle"> </span>
          </span>
        </label>
        <span v-if="notifyProcessing" class="c-spinner"></span>
      </div>
    </section>

    <section>
      <strong>Details</strong>
      <template>
        <p v-if="serverKey">Vapid public key(VITE_PUSH_SERVER_KEY):</p>
        <code>{{ serverKey }}</code>
      </template>
      <Code v-if="subscription" :copy="false">
        <pre>{{ JSON.stringify(subscription, null, 4) }}</pre>
      </Code>
    </section>
  </div>
</template>

<script>
import Code from "@operational.co/components/code/index.vue";

export default {
  components: {
    Code,
  },

  data: function () {
    return {
      notifyProcessing: false,
      pushNotificationProcessing: false,

      isServiceWorkerRegistered: false,

      notify: false,
      trigger: false,

      pushNotificationError: "",

      load: false,

      subscription: null,
    };
  },

  watch: {
    notify: function () {
      if (!this.load) {
        return;
      }
      this.onNotify(this.notify);
    },
  },

  computed: {
    isSelfHosted: function () {
      const condition = this.$store.app.isSelfHosted;
      return condition;
    },
    serverKey: function () {
      return import.meta.env.VITE_PUSH_SERVER_KEY;
    },
    isNotify: function () {
      if (!this.user) {
        return;
      }

      return !!this.user.notify;
    },
    isPwa: function () {
      return this.$store.app.isPwa;
    },
    testMode: function () {
      return this.$store.app.testMode;
    },
    displayMode: function () {
      return this.$store.app.displayMode;
    },
    user: function () {
      return this.$store.user.resource;
    },
    status: function () {
      let t = this.trigger;
      let status = Notification.permission;
      //status = "denied";
      return status;
    },
    statusText: function () {
      let status = this.status;

      if (!status) {
        return "";
      }

      let str = "";

      switch (status) {
        case "granted":
          str = "Notifications are allowed on this device.";
          break;
        case "denied":
          str =
            "Notifications are denied on this device. You won't receive push notifications even if they are enabled.";
          break;
        case "default":
          str = "Notification permission has not been requested yet.";
          break;
      }
      return str;
    },
    settingsText: function () {
      const notify = this.isNotify;

      if (notify) {
        return `Push notifications are enabled for your account`;
      }

      return `Push notifications are disabled for your account. We recommend keeping them on.`;
    },
    titleText: function () {
      let user = this.user;

      if (!user) {
        return "";
      }

      let notify = user.notify;

      notify = !!notify;

      let status = this.status;

      if (notify && status === "granted") {
        return `Push notifications are enabled.`;
      }

      if (notify && status === "denied") {
        return `Push notifications are allowed but this device doesn't have permissions enabled.`;
      }

      if (notify && status === "default") {
        return `Push notifications are allowed but this device doesn't have permissions enabled.`;
      }

      if (!notify) {
        return `Push notifications are disabled.`;
      }
    },
  },

  methods: {
    async sendTestPushNotification() {
      this.pushNotificationProcessing = true;
      try {
        await this.$store.app.sendTestPushNotification();
      } catch (err) {
        if (err.message) {
          this.pushNotificationError = err.message;
        } else {
          this.pushNotificationError = `Couldn't send push notification. Something went wrong.`;
        }
      }
      this.pushNotificationProcessing = false;
    },
    async onNotify(notify) {
      this.notifyProcessing = true;
      let form = {
        notify: notify,
      };

      let res = await this.$store.user.update(form);
      if (notify) {
        this.$store.app.sendNotification(`Push notifications enabled.`);
      } else {
        this.$store.app.sendNotification(`Push notifications disabled.`);
      }
      this.notifyProcessing = false;
    },
    onTestModeClick: function () {
      let condition = true;
      if (this.testMode) {
        condition = false;
      }
      this.$store.app.setTestMode(condition);
    },
    async enablePush() {
      let registration = await navigator.serviceWorker
        .register("/service-worker.js")
        .catch((err) => {
          this.$store.app.sendNotification(`ERROR 1 ${err}`);
          console.log(err);
        });

      if (!registration) {
        return;
      }

      if (!registration.pushManager) {
        return;
      }

      let key = import.meta.env.VITE_PUSH_SERVER_KEY;

      let subscription = await registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: key,
        })
        .catch((err) => {
          console.log(err);
          console.log(key);
          this.$store.app.sendNotification(
            `Push notifications couldn't be enabled. Please check if VITE_PUSH_SERVER_KEY is correct, or manually enable notifications through the browser.`,
          );
        });

      if (!subscription) {
        return;
      }

      this.$store.app.subscribe(subscription);

      this.$store.app.sendNotification("Push enabled!");

      this.trigger = !this.trigger;
    },

    async loadPushSubscription() {
      const data = await this.$store.app.isServiceWorkerRegistered().catch((err) => {
        console.log(data);
      });
      this.isServiceWorkerRegistered = data;
      try {
        const registration = await navigator.serviceWorker.ready;
        this.subscription = await registration.pushManager.getSubscription();
      } catch (err) {
        console.log(err);
      }
    },
  },

  created: function () {
    if (!this.user) {
      return;
    }
    this.notify = this.user.notify;
  },

  mounted: function () {
    this.load = true;

    this.loadPushSubscription();
  },
};
</script>

<style lang="scss">
.c-app-permission {
  strong {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 0;
  }

  .c-notify {
    .c-switch {
      margin-top: 0.5rem;
    }

    .c-spinner {
      margin-left: var(--margin);
    }
  }

  &__error {
    margin-top: 0.5rem;

    color: hsl(var(--hue-red), 82%, 72%);
  }

  &__label {
    display: inline-block;
    margin-right: var(--margin);

    color: hsl(var(--hue-green), 70%, 55%);

    &.failure {
      color: hsl(var(--hue-red), 62%, 56%);
    }

    &.warning {
      color: hsl(var(--hue-orange), 72%, 58%);
    }
  }

  &__status {
    margin-top: var(--margin);
    display: flex;
    align-items: flex-start;

    > span {
      --current-hue: var(--hue-orange);
      display: inline-block;
      min-width: 8px;
      height: 8px;
      margin-top: 8px;
      margin-left: 4px;
      margin-right: 12px;
      border-radius: 99px;
      background-color: hsl(var(--current-hue), 70%, 50%);
      box-shadow: 0 0 0 4px hsla(var(--current-hue), 50%, 50%, 0.4);

      &.granted {
        --current-hue: var(--hue-green);
      }

      &.denied {
        --current-hue: var(--hue-red);
      }

      &.default {
      }
    }

    > p {
      margin: 0;
    }
  }

  section {
    margin-bottom: var(--margin-lg);
    padding: var(--margin-lg);
    background-color: var(--color-bg-2);
    border-radius: var(--border-radius);

    a {
      display: flex;
      align-items: flex-start;
      color: var(--color-font);
      text-decoration: underline;

      > svg {
        min-width: 18px;
        margin-top: 6px;
        margin-right: var(--margin);
      }
    }

    .btn {
      margin-top: var(--margin);
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
