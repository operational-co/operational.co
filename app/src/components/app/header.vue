<template>
  <div :class="['c-app-header', { offline: offline === true }]">
    <div class="c-app-header__inner">
      <section>
        <a href="/" class="logo">
          <img src="/logo.png" />
          <span>{{ subtitleText }}</span>
        </a>
        <span class="c-app-header__testmode" v-if="testMode"> Test mode active </span>
      </section>
      <section :class="['c-app-header__menu']">
        <!-- <router-link to="/crm"> Users </router-link> -->
        <router-link to="/">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 6H19M7 3H17M5 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V19C3 20.1046 3.89543 21 5 21Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <span>Events</span>
        </router-link>
        <router-link to="/dashboards">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.38803 19.923L5.72852 19.2548H5.72852L5.38803 19.923ZM4.07698 18.612L3.40873 18.9525H3.40873L4.07698 18.612ZM19.923 18.612L19.2548 18.2715V18.2715L19.923 18.612ZM18.612 19.923L18.2715 19.2548H18.2715L18.612 19.923ZM19.923 5.38803L19.2548 5.72852V5.72852L19.923 5.38803ZM18.612 4.07698L18.9525 3.40873V3.40873L18.612 4.07698ZM4.07698 5.38803L4.74524 5.72852L4.07698 5.38803ZM5.38803 4.07698L5.72852 4.74524L5.38803 4.07698ZM19.5 8.55V15.45H21V8.55H19.5ZM15.45 19.5H8.55V21H15.45V19.5ZM4.5 15.45V8.55H3V15.45H4.5ZM8.55 4.5H15.45V3H8.55V4.5ZM8.55 19.5C7.69755 19.5 7.10331 19.4994 6.64068 19.4616C6.1868 19.4245 5.92604 19.3554 5.72852 19.2548L5.04754 20.5913C5.49175 20.8176 5.97189 20.912 6.51853 20.9566C7.05641 21.0006 7.7223 21 8.55 21V19.5ZM3 15.45C3 16.2777 2.99942 16.9436 3.04336 17.4815C3.08803 18.0281 3.18238 18.5082 3.40873 18.9525L4.74524 18.2715C4.6446 18.074 4.57546 17.8132 4.53838 17.3593C4.50058 16.8967 4.5 16.3025 4.5 15.45H3ZM5.72852 19.2548C5.30516 19.039 4.96095 18.6948 4.74524 18.2715L3.40873 18.9525C3.76825 19.6581 4.34193 20.2317 5.04754 20.5913L5.72852 19.2548ZM19.5 15.45C19.5 16.3025 19.4994 16.8967 19.4616 17.3593C19.4245 17.8132 19.3554 18.074 19.2548 18.2715L20.5913 18.9525C20.8176 18.5082 20.912 18.0281 20.9566 17.4815C21.0006 16.9436 21 16.2777 21 15.45H19.5ZM15.45 21C16.2777 21 16.9436 21.0006 17.4815 20.9566C18.0281 20.912 18.5082 20.8176 18.9525 20.5913L18.2715 19.2548C18.074 19.3554 17.8132 19.4245 17.3593 19.4616C16.8967 19.4994 16.3025 19.5 15.45 19.5V21ZM19.2548 18.2715C19.0391 18.6948 18.6948 19.039 18.2715 19.2548L18.9525 20.5913C19.6581 20.2317 20.2318 19.6581 20.5913 18.9525L19.2548 18.2715ZM21 8.55C21 7.7223 21.0006 7.05641 20.9566 6.51853C20.912 5.97189 20.8176 5.49175 20.5913 5.04754L19.2548 5.72852C19.3554 5.92604 19.4245 6.1868 19.4616 6.64068C19.4994 7.10331 19.5 7.69755 19.5 8.55H21ZM15.45 4.5C16.3025 4.5 16.8967 4.50058 17.3593 4.53838C17.8132 4.57546 18.074 4.6446 18.2715 4.74524L18.9525 3.40873C18.5082 3.18238 18.0281 3.08803 17.4815 3.04336C16.9436 2.99942 16.2777 3 15.45 3V4.5ZM20.5913 5.04754C20.2318 4.34193 19.6581 3.76825 18.9525 3.40873L18.2715 4.74524C18.6948 4.96095 19.0391 5.30516 19.2548 5.72852L20.5913 5.04754ZM4.5 8.55C4.5 7.69755 4.50058 7.10331 4.53838 6.64068C4.57546 6.1868 4.6446 5.92604 4.74524 5.72852L3.40873 5.04754C3.18238 5.49175 3.08803 5.97189 3.04336 6.51853C2.99942 7.05641 3 7.7223 3 8.55H4.5ZM8.55 3C7.7223 3 7.05641 2.99942 6.51853 3.04336C5.97189 3.08803 5.49175 3.18238 5.04754 3.40873L5.72852 4.74524C5.92604 4.6446 6.1868 4.57546 6.64068 4.53838C7.10331 4.50058 7.69755 4.5 8.55 4.5V3ZM4.74524 5.72852C4.96095 5.30516 5.30516 4.96095 5.72852 4.74524L5.04754 3.40873C4.34193 3.76825 3.76825 4.34193 3.40873 5.04754L4.74524 5.72852Z"
              fill="currentColor"
            />
            <path
              d="M12 13.5H11.25V15H12V13.5ZM20.25 15H21V13.5H20.25V15ZM12 15H20.25V13.5H12V15Z"
              fill="currentColor"
            />
            <path
              d="M12 10.5H12.75V9H12V10.5ZM3.75 9H3V10.5H3.75V9ZM12 9H3.75V10.5H12V9Z"
              fill="currentColor"
            />
            <path
              d="M11.25 20.25V21H12.75V20.25H11.25ZM12.75 3.75V3H11.25V3.75H12.75ZM11.25 3.75V20.25H12.75V3.75H11.25Z"
              fill="currentColor"
            />
          </svg>

          <span>Dashboards</span>
        </router-link>
        <!-- <router-link to="/settings"> <span>Settings</span> </router-link> -->
        <router-link to="/playground">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 6.75C3.75 5.64543 4.64543 4.75 5.75 4.75H9.25V4.5C9.25 2.98122 10.4812 1.75 12 1.75C13.5188 1.75 14.75 2.98122 14.75 4.5V4.75H18.25C19.3546 4.75 20.25 5.64543 20.25 6.75V9.25H20C18.4812 9.25 17.25 10.4812 17.25 12C17.25 13.5188 18.4812 14.75 20 14.75H20.25V17.25C20.25 18.3546 19.3546 19.25 18.25 19.25H5.75C4.64543 19.25 3.75 18.3546 3.75 17.25V6.75Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="square"
              stroke-linejoin="round"
            />
          </svg>

          <span>Playground </span>
        </router-link>
      </section>

      <section class="c-app-header__name">Settings</section>

      <section>
        <a
          :class="['popup-menu-button', { active: menuActive === true }]"
          @click.prevent="onMenuOpen"
        >
          <span v-if="workspace"> {{ workspace.name }}</span>
          <Avatar :workspace="workspace"> </Avatar>
        </a>

        <PopupMenu
          v-if="init"
          selector=".popup-menu-button"
          ref="PopupMenu"
          @onClose="onMenuClose"
        ></PopupMenu>
      </section>
    </div>
  </div>
</template>

<script>
import PopupMenu from "./popup-menu.vue";
import Constrain from "@operational.co/components/ui/constrain.vue";

import Avatar from "@operational.co/components/ui/avatar.vue";

export default {
  components: {
    PopupMenu,
    Constrain,
    Avatar,
  },

  data: function () {
    return {
      init: false,
      menuActive: false,

      lastScrollPosition: 0,
      showNav: true,
    };
  },

  computed: {
    appVersion: function () {
      return __APP_VERSION__;
    },
    isSelfHosted: function () {
      return this.$store.app.isSelfHosted;
    },
    subtitleText: function () {
      if (this.isSelfHosted) {
        return `Self-hosted ${this.appVersion}`;
      } else {
        return "Beta";
      }
    },
    testMode: function () {
      return this.$store.app.testMode;
    },
    offline: function () {
      return this.$store.app.offline;
    },
    user: function () {
      return this.$store.user.resource;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    baseApiUrl: function () {
      return this.$store.app.baseApiUrl;
    },
    assetPath: function () {
      let baseUrl = this.baseApiUrl;
      return `${baseUrl}/uploads`;
    },
  },

  methods: {
    onDocs: function () {
      this.$store.app.showDocs();
    },
    onSupport: function () {
      $crisp.push(["do", "chat:show"]);
      $crisp.push(["do", "chat:open"]);
    },
    onMenuClose: function () {
      this.menuActive = false;
    },
    logout: function () {
      this.$store.user.logout();
    },
    onMenuOpen: function () {
      this.menuActive = true;
      this.$refs.PopupMenu.toggle();
    },
    handleScroll() {
      const currentScrollPosition = window.scrollY;
      if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 100) {
        // User is scrolling down
        this.showNav = false;
      } else {
        // User is scrolling up or at the top
        this.showNav = true;
      }
      this.lastScrollPosition = currentScrollPosition;
    },
    addEventListeners: function () {
      window.addEventListener("scroll", this.handleScroll);
    },
    removeEventListeners: function () {
      window.removeEventListener("scroll", this.handleScroll);
    },
  },

  mounted: function () {
    this.init = true;

    this.addEventListeners();
  },

  beforeUnmount: function () {
    this.removeEventListeners();
  },
};
</script>

<style lang="scss">
.c-app-header {
  width: 100%;
  height: 56px;

  &__testmode {
    display: inline-block;
    padding: var(--margin) var(--margin-lg);
    margin-left: var(--margin-lg);
    background-color: var(--color-bg-3);
    border-radius: var(--border-radius);
    font-family: var(--font-family-monospace);
    font-weight: 400;
    font-size: var(--font-size-xxs);
    line-height: 1;
  }

  &__inner {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;

    > section {
      padding: var(--margin) var(--margin-lg);

      &:first-child {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;

        display: flex;
        align-items: center;
      }

      &:nth-child(2) {
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        transform: translateX(-50%);
      }

      &:last-child {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;

        display: flex;
        align-items: center;
      }
    }

    .c-constrain {
      flex-grow: 1;
    }

    .logo {
      position: relative;
      margin-right: auto;

      display: flex;
      align-items: center;

      img {
        width: 32px;
        height: 32px;
      }

      span {
        display: inline-block;
        padding: var(--margin-sm);
        margin-left: var(--margin);
        font-size: var(--font-size-xxs);
        font-weight: 600;
        font-family: var(--font-family-monospace);
        line-height: 1;
        color: var(--color-font-light);
        background-color: var(--color-bg-2);
        border-radius: var(--border-radius);
      }
    }

    > a {
      user-select: none;
      cursor: pointer;
    }

    .popup-menu-button {
      position: relative;
      max-width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      margin-right: 0;
      padding: var(--margin) var(--margin-lg);
      padding-right: var(--margin);
      background-color: var(--color-bg-3);
      color: var(--color-font);
      transition: all var(--transition-time-sm) linear;
      cursor: pointer;

      .c-avatar {
        width: 24px !important;
        height: 24px;
        min-width: 24px !important;
        object-fit: cover;
        object-position: center center;
      }

      > span {
        display: inline-block;
        margin-right: var(--margin);
        font-weight: 500;
        pointer-events: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        user-select: none;
      }

      > .c-avatar {
        user-select: none;
      }

      > svg {
        min-width: 32px;
      }

      &:hover,
      &:active,
      &.active {
        background-color: var(--color-primary-dark);
        color: var(--color-primary);
      }
    }
  }

  &__name {
    display: none;
  }

  &__menu {
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      height: 32px;
      position: relative;
      display: inline-flex;
      align-items: center;
      margin: 0 var(--margin);
      padding: var(--margin);
      padding-right: var(--margin-lg);
      color: var(--color-font);
      transition: var(--transition);
      font-weight: 500;
      font-size: var(--font-size-xs);
      //background-color: var(--color-bg-3);
      border-radius: var(--border-radius);
      user-select: none;
      line-height: 1rem;

      svg {
        margin-right: 4px;
      }

      &:hover,
      &:active,
      &:focus {
        outline: none;
        background-color: var(--color-bg-3);
        color: var(--color-link-hover);
      }

      &.router-link-active {
        color: var(--color-link-hover);
        background-color: var(--color-bg-3);
        //background-color: var(--color-primary);
      }
    }
  }

  &.offline {
    .c-app-header__menu a,
    .popup-menu-button,
    .c-app-header__mobile a {
      opacity: 0.75;
      pointer-events: none;
    }
  }

  @media screen and (max-width: 940px) {
    height: 40px;
    //background-color: var(--color-bg-2);

    .c-avatar {
      width: 24px;
      height: 24px;
    }

    .c-constrain__inner {
      padding: 0;
    }

    .logo {
      img {
        width: 26px;
        height: 26px;
      }
    }

    .popup-menu-button {
      background-color: transparent;
      font-size: var(--font-size-xs);

      &:hover,
      &:active {
        background-color: transparent;
      }
    }

    &__menu {
      display: none;
    }
  }

  @supports (-webkit-touch-callout: none) {
    &__mobile {
      padding-bottom: var(--spacer);
    }
  }
}
</style>
