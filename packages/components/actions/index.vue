<template>
  <div class="c-actions">
    <div v-for="(action, i) in computedActions" :key="i">
      <button
        :disabled="lock === true || (action && action.status === 'DONE') || action._expired"
        type="button"
        :class="[
          action.klass,
          { 'btn-success': action.status && action.status === 'DONE' },
          { active: activeSlug === action.slug },
          { 'btn-sm': size === 'sm' }
        ]"
        @click.prevent="onAction(action)"
        :title="action.url"
      >
        <svg
          v-if="action.status && action.status === 'DONE'"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 13L10 16L17 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          v-if="action.external"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 5.5L10.7514 4.75837C13.0959 2.41387 16.8971 2.41388 19.2416 4.75837C21.5861 7.10287 21.5861 10.9041 19.2416 13.2486L18.5 14M5.5 10L4.75837 10.7514C2.41387 13.0959 2.41388 16.8971 4.75838 19.2416C7.10287 21.5861 10.9041 21.5861 13.2486 19.2416L14 18.5M10 14L14 10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span v-if="activeSlug === action.slug" class="c-spinner"></span>
        <span>
          {{ action.buttonText }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  data: function () {
    return {
      lock: false,
      activeSlug: null
    };
  },

  props: {
    actions: {
      type: Object,
      default: function () {
        return [];
      }
    },
    createdAt: {},
    size: {
      default: ""
    }
  },

  computed: {
    computedActions: function () {
      let actions = this.actions;

      actions = actions.filter((action) => {
        if (typeof action === "string") {
          return false;
        }
        if (action._error) {
          return false;
        }
        return true;
      });

      const date1 = dayjs();

      for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        action.klass = "btn";

        if (action.type === "danger") {
          action.klass = "btn btn-danger";
        }

        if (action.type === "important") {
          action.klass = "btn btn-primary";
        }

        action._expired = false;

        if (this.createdAt) {
          const date2 = dayjs(this.createdAt).add(action.expireIn, "minute");

          const diff = date1.diff(date2, "m");

          //console.log(diff);

          if (diff > action.expireIn) {
            action._expired = true;
          }
        }

        actions[i] = action;
      }

      return actions;
    }
  },

  methods: {
    async onAction(action) {
      if (!action.external) {
        this.$emit("onConfirmAction", action);
        return;
      } else {
        window.open(action.url, "_blank");
        return;
      }
    }
  }
};
</script>

<style lang="scss">
.c-actions {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .btn {
    margin-right: var(--margin);
    margin-bottom: var(--margin-sm);

    &.btn-primary {
      background-color: var(--color-primary);
    }

    &.btn-danger {
      background-color: var(--color-danger);
    }

    > svg {
      margin-left: calc(-1 * var(--margin));
      margin-right: var(--margin);
    }
  }

  @media screen and (max-width: 576px) {
    display: grid;
    grid-row-gap: 8px;
    grid-template-rows: repeat(1fr);

    .btn {
      width: 100%;
      font-size: var(--font-size-sm);
      height: initial;
      min-height: initial;
      padding: 2px var(--spacer-sm);

      > svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
