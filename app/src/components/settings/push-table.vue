<template>
  <div class="c-push-table">
    <template v-if="pushes">
      <article v-for="session in pushes" :key="session.id">
        <label
          v-if="
            subscription &&
            session.pushSubscription &&
            subscription.endpoint === session.pushSubscription.endpoint
          "
          >Current</label
        >
        <code>{{ session.sessionSid }}</code>
        <small> Expiry in {{ formatDate(session.expiresAt) }} </small>
      </article>
    </template>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data: function () {
    return {
      pushes: [],
      subscription: null,
    };
  },

  methods: {
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
    async loadPushes() {
      let pushes = await this.$store.app.loadPushes();
      this.pushes = pushes;
    },
    formatDate: function (str) {
      return moment(str).fromNow();
    },
  },

  mounted: function () {
    this.loadPushes();
    this.loadPushSubscription();
  },
};
</script>

<style lang="scss">
.c-push-table {
  article {
    padding: var(--margin);
    margin-bottom: var(--margin);
    border-radius: var(--border-radius);
    background-color: var(--color-bg-3);

    code {
      display: block;
      padding: 0;
      background-color: transparent;
      box-shadow: none;
    }

    label {
      display: inline-block;
      margin-bottom: var(--margin);
      font-size: var(--font-size-xs);
      font-weight: 600;
      line-height: 1;
      padding: var(--margin-sm);
      border-radius: var(--border-radius);
      background-color: var(--color-primary);
    }
  }
}
</style>
