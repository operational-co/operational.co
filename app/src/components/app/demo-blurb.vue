<template>
  <div class="c-demo-blurb">
    <transition>
      <div class="c-demo-blurb__inner" v-if="active">
        <p v-if="user">👋 Heyo, {{ user.firstName }} here. I'm a demo account for Operational.</p>
        <p>Here's my workspace where I log events for my SaaS.</p>
        <p>
          Feel free to explore, and if you have any questions you can ask via the in-app chat widget
          and Shash will get back to you!
        </p>
        <button type="button" class="btn btn-wide" @click.prevent="onClose">
          Close this blurb
        </button>
        <button type="button" class="btn btn-wide btn-primary" @click.prevent="onSignup">
          Signup now
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data: function () {
    return {};
  },

  props: {
    active: {
      default: false,
    },
  },

  watch: {
    active: function () {
      if (this.active) {
        const { query, params, path, hash } = this.$route;
        console.log(query);
        const url = new URL(window.location.href); // Get the current URL
        url.searchParams.delete("signinas"); // Remove the query parameter

        // Update the URL without reloading the page
        window.history.replaceState({}, "", url);
      }
    },
  },
  computed: {
    user: function () {
      return this.$store.user.resource;
    },
    metrics: function () {
      return this.$store.metric.resources;
    },
    currentMetric: function () {
      if (!this.metrics) {
        return null;
      }
      return this.metrics[0];
    },
    currentEvents: function () {
      if (!this.currentMetric) {
        return 0;
      }
      return this.currentMetric.events;
    },
    isDemo: function () {
      return this.$store.workspace.isDemo;
    },
  },

  methods: {
    humanizeNumber: function (number) {
      // Convert number to string
      let strNumber = number.toString();

      // Use regex to add commas every three digits
      strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return strNumber;
    },
    onClose: function () {
      this.$emit("onClose");
    },
    onSignup: function () {
      window.location.href = "https://app.operational.co";
    },
    checkStatus: function () {
      if (this.isDemo) {
        this.active = true;
      }
    },
  },
};
</script>

<style lang="scss">
.c-demo-blurb {
  position: fixed;
  z-index: 1;
  bottom: 1rem;
  left: 1rem;

  &__inner {
    padding: var(--margin-lg);
    font-size: var(--font-size-sm);

    width: 290px;

    border-radius: var(--border-radius);
    background-color: var(--color-bg-3);
    border: 0.5px solid rgba(92, 99, 112, 0.4);
    border-top-color: rgba(92, 99, 112, 0.55);

    text-decoration: none;

    box-shadow:
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.04) 0px 1px 3px -1px,
      rgba(0, 0, 0, 0.04) 0px 1px 4px -1px;
  }

  .v-enter-active,
  .v-leave-active {
    transition: all var(--transition-time) ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  strong {
    font-weight: 500;
    color: hsl(var(--hue-p), 92%, 53%);
  }

  &.danger {
    background-color: hsl(var(--hue-red), 50%, 10%);
    strong {
      color: hsl(var(--hue-red), 92%, 53%);
    }
  }

  p {
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .btn {
    margin-top: 1rem;
  }

  @media screen and (max-width: 940px) {
    max-width: 290px;
    width: initial;
    bottom: calc(59px + 1rem);
  }
}
</style>
