<template>
  <Popup :selector="selector" klass="c-popup-menu" @onClose="onClose" :active="active">
    <div class="c-popup-menu__top">
      <small v-if="user"> {{ user.email }} </small>
    </div>
    <div class="c-popup-menu__middle">
      <span> Projects </span>
      <a
        href="#"
        v-for="workspace in user.workspaces"
        :key="workspace.id"
        @click.prevent="switchWorkspace(workspace)"
      >
        <Avatar :workspace="workspace"></Avatar>
        <span>
          {{ workspace.name }}
        </span>
        <strong
          title="Current project"
          v-if="workspace.id === user.primaryWorkspace"
          v-tooltip="'This is your current project'"
        >
          P
        </strong>
      </a>
      <a href="#" @click.prevent="createWorkspace" v-if="!isDemo">
        <span> Create new project </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H12M19 12H12M12 12V5M12 12V19"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </div>
    <div class="c-popup-menu__bottom">
      <!-- <article v-if="workspace" class="c-popup-menu__usage">
				<h3>
					{{ humanizeNumber(workspace.usedFreeEvents) }} /
					{{ humanizeNumber(workspace.freeEvents) }}
				</h3>
				<span>events so far</span>
			</article> -->
      <router-link to="/settings">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.3 5.7L6.375 5.025L5.025 6.375L5.7 9.3L3 11.1V12.9L5.7 14.7L5.025 17.625L6.375 18.975L9.3 18.3L11.1 21H12.9L14.7 18.3L17.625 18.975L18.975 17.625L18.3 14.7L21 12.9V11.1L18.3 9.3L18.975 6.375L17.625 5.025L14.7 5.7L12.9 3H11.1L9.3 5.7Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>

        <span> Settings</span>
      </router-link>
      <a href="https://operational.co/docs/start-here" target="_blank">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 14H13M9 10H15M5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <span> Docs </span>
      </a>
      <a href="https://discord.gg/BdTbsQhRzc" target="_blank">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.6361 5.0228C18.1907 4.35756 16.6648 3.88561 15.0973 3.61902C14.8828 4.00447 14.6888 4.40105 14.5159 4.8071C12.8463 4.55418 11.1484 4.55418 9.47881 4.8071C9.30587 4.4011 9.1118 4.00452 8.8974 3.61902C7.32897 3.88786 5.80205 4.36093 4.35518 5.02628C1.48276 9.29851 0.70409 13.4646 1.09342 17.5716C2.77558 18.821 4.6584 19.7712 6.66003 20.3809C7.11074 19.7715 7.50956 19.1251 7.85226 18.4483C7.20135 18.2039 6.57311 17.9024 5.9748 17.5473C6.13227 17.4325 6.28627 17.3142 6.43508 17.1994C8.17601 18.0224 10.0761 18.4491 12 18.4491C13.9238 18.4491 15.8239 18.0224 17.5648 17.1994C17.7154 17.3229 17.8694 17.4412 18.0251 17.5473C17.4257 17.903 16.7963 18.2051 16.1442 18.4501C16.4865 19.1265 16.8853 19.7724 17.3364 20.3809C19.3398 19.7737 21.224 18.8239 22.9065 17.5734C23.3633 12.8106 22.1261 8.68273 19.6361 5.0228ZM8.34541 15.0459C7.26047 15.0459 6.36414 14.0561 6.36414 12.8384C6.36414 11.6208 7.22932 10.6223 8.34195 10.6223C9.45458 10.6223 10.344 11.6208 10.325 12.8384C10.3059 14.0561 9.45112 15.0459 8.34541 15.0459ZM15.6545 15.0459C14.5678 15.0459 13.675 14.0561 13.675 12.8384C13.675 11.6208 14.5401 10.6223 15.6545 10.6223C16.7689 10.6223 17.6514 11.6208 17.6323 12.8384C17.6133 14.0561 16.7602 15.0459 15.6545 15.0459Z"
            fill="currentColor"
          />
        </svg>
        <span> Discord </span>
      </a>
      <a href="#" @click.prevent="onLogout">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2V12M16 4.93555C18.9634 6.40825 21 9.46631 21 13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13C3 9.46631 5.03656 6.40825 8 4.93555"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span> Logout </span>
      </a>
    </div>
  </Popup>
</template>

<script>
import Popup from "@operational.co/components/ui/popup.vue";
import { userApi } from "@/store/user.js";

import Avatar from "@operational.co/components/ui/avatar.vue";

export default {
  components: {
    Popup,
    Avatar,
  },

  data: function () {
    return {
      active: false,
    };
  },

  props: {
    selector: {
      type: String,
      default: "body",
    },
  },

  computed: {
    isDemo: function () {
      return this.$store.workspace.isDemo;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    user: function () {
      return this.$store.user.resource;
    },
    metrics: function () {
      return this.$store.metric.resources;
    },
    lastMetric: function () {
      if (!this.metrics) {
        return;
      }
      return this.metrics[0];
    },
  },

  methods: {
    onLogout: function () {
      this.$store.user.logout();
    },
    onClose: function () {
      this.active = false;
      this.$emit("onClose");
    },
    toggle: function () {
      this.active = !this.active;
    },
    switchWorkspace: function (workspace) {
      if (workspace.id === this.workspace.id) {
        return;
      }
      this.$store.app.setSwitchWorkspace();
      this.active = false;
      if (workspace.id === this.user.primaryWorkspace) {
        return;
      }

      userApi
        .switchWorkspace({
          newWorkspace: workspace.id,
        })
        .then(() => {
          window.location.reload();
        });
    },
    createWorkspace: function () {
      this.$store.app.setCreateWorkspace(true);
    },
    humanizeNumber: function (number) {
      // Convert number to string
      let strNumber = number.toString();

      // Use regex to add commas every three digits
      strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return strNumber;
    },
  },

  mounted: async function () {},
};
</script>

<style lang="scss">
.c-popup-menu {
  min-width: 260px;
  //box-shadow: inset 0 1px 2px hsla(260, 2%, 32%, 0.2), 0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 5px 10px -5px rgba(0, 0, 0, 0.3);
  background-color: var(--color-bg-3);
  box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.08) 0px 6px 16px -2px,
    rgba(0, 0, 0, 0.1) 0px 16px 80px -8px;
  .c-arrow {
    color: var(--color-bg-3);
  }

  &__top {
    padding: var(--margin-lg);
    > small {
      display: block;
    }
  }

  &__middle {
    background-color: var(--color-bg-2);
    padding-bottom: var(--margin-sm);
    border-top: var(--color-bg-4) solid 1px;
    border-bottom: var(--color-bg-4) solid 1px;

    > span {
      font-weight: 500;
      font-size: var(--font-size-xs);
      opacity: 0.8;
      padding: var(--margin) var(--margin-lg);
    }

    > a {
      display: flex;
      align-items: center;
      padding: var(--margin) var(--margin-lg);
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--color-font);

      .c-avatar {
        margin-right: var(--margin);
      }

      &:hover,
      &:active,
      &:focus {
        color: Var(--color-font);
        background-color: var(--color-bg-3);
      }

      > strong {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-left: auto;
        text-align: center;
        line-height: 1.6;
        font-size: var(--font-size-xs);
        background-color: var(--color-primary);
        border-radius: var(--border-radius-sm);
      }

      > svg {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-left: auto;
        text-align: center;
        padding: var(--margin-sm);
        font-size: var(--font-size-xs);
        background-color: var(--color-bg-4);
        border-radius: var(--border-radius-sm);
      }
    }
  }

  &__bottom {
    padding: var(--margin);
    //background-color: rgba(0, 0, 0, 0.2);

    a {
      width: 100%;
      font-size: var(--font-size-sm);
      display: grid;
      align-items: center;
      grid-template-columns: 24px 1fr;
      grid-column-gap: var(--margin);
      padding: var(--margin);
      color: var(--color-font);
      border-radius: var(--border-radius-sm);
      user-select: none;

      &:not(:last-child) {
        margin-bottom: 4px;
      }

      &:hover,
      &:active {
        background-color: var(--color-bg-5);
      }
    }
  }

  &__usage {
    padding: var(--margin);
    background-color: var(--color-bg-4);
    margin-bottom: var(--margin);
    border-radius: var(--border-radius);
    h3 {
      font-size: var(--font-size-lg);
      font-weight: 300;
      margin-bottom: 0.25rem;
    }

    span {
      font-size: var(--font-size-sm);
    }
  }
}
</style>
