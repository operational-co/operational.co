<template>
  <div :class="['c-mobile-footer', { active: showNav === true }]">
    <router-link to="/settings">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.6447 5.54878L6.90046 5.14626C6.57358 5.07083 6.23089 5.16911 5.99368 5.40632L5.40632 5.99368C5.16911 6.23089 5.07083 6.57358 5.14626 6.90046L5.54878 8.6447C5.63978 9.03905 5.47717 9.44855 5.14043 9.67305L3.43326 10.8112C3.16258 10.9916 3 11.2954 3 11.6207V12.3793C3 12.7046 3.16259 13.0084 3.43326 13.1888L5.14043 14.327C5.47717 14.5514 5.63978 14.9609 5.54878 15.3553L5.14626 17.0995C5.07083 17.4264 5.16911 17.7691 5.40632 18.0063L5.99368 18.5937C6.23089 18.8309 6.57358 18.9292 6.90046 18.8537L8.6447 18.4512C9.03905 18.3602 9.44855 18.5228 9.67305 18.8596L10.8112 20.5667C10.9916 20.8374 11.2954 21 11.6207 21H12.3793C12.7046 21 13.0084 20.8374 13.1888 20.5667L14.327 18.8596C14.5514 18.5228 14.9609 18.3602 15.3553 18.4512L17.0995 18.8537C17.4264 18.9292 17.7691 18.8309 18.0063 18.5937L18.5937 18.0063C18.8309 17.7691 18.9292 17.4264 18.8537 17.0995L18.4512 15.3553C18.3602 14.9609 18.5228 14.5514 18.8596 14.327L20.5667 13.1888C20.8374 13.0084 21 12.7046 21 12.3793V11.6207C21 11.2954 20.8374 10.9916 20.5667 10.8112L18.8596 9.67305C18.5228 9.44855 18.3602 9.03905 18.4512 8.6447L18.8537 6.90046C18.9292 6.57358 18.8309 6.23089 18.5937 5.99368L18.0063 5.40632C17.7691 5.16911 17.4264 5.07083 17.0995 5.14626L15.3553 5.54878C14.9609 5.63978 14.5514 5.47717 14.327 5.14043L13.1888 3.43326C13.0084 3.16258 12.7046 3 12.3793 3H11.6207C11.2954 3 10.9916 3.16259 10.8112 3.43326L9.67305 5.14043C9.44855 5.47717 9.03905 5.63978 8.6447 5.54878Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>

      <span> Settings </span>
    </router-link>

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

      <span> Events </span>
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

      <span> Dashboard </span>
    </router-link>
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
.c-mobile-footer {
  display: none;
  width: 100%;
  height: 60px;

  &__testmode {
    display: inline-block;
    padding: var(--margin) var(--margin-lg);
    margin-left: var(--margin-lg);
    background-color: var(--color-bg-3);
    border-radius: var(--border-radius);
    font-family: var(--font-family-monospace);
    font-weight: 400;
    font-size: var(--font-size-sm);
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

      h1 {
        display: inline-block;
        padding: var(--margin);
        font-size: var(--font-size-lg);
        margin: 0;
        color: var(--color-font);
        transition: all var(--transition-time) linear;

        &:hover,
        &:active {
          color: var(--color-primary-light);
        }
      }

      span {
        display: inline-block;
        padding: var(--margin-sm) var(--margin);
        margin-left: var(--margin);
        font-size: var(--font-size-xs);
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
      border-radius: 99px;
      margin-right: 0;
      padding: var(--margin) var(--margin-lg);
      padding-right: var(--margin);
      background-color: var(--color-bg-3);
      color: var(--color-font);
      transition: all var(--transition-time-sm) linear;
      cursor: pointer;

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
      padding: var(--margin) var(--spacer-sm);
      color: var(--color-font);
      transition: var(--transition);
      font-weight: 500;
      //background-color: var(--color-bg-3);
      border-radius: var(--border-radius);
      user-select: none;
      line-height: 1rem;

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

  @media screen and (max-width: 940px) {
    display: block;
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-top: 0;

    width: 100%;
    display: flex;
    justify-content: space-evenly;
    background-color: var(--color-bg-1);
    border-top: var(--color-bg-3) solid 1px;
    //background-color: hsla(206, 8%, 20%, 0.75);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    padding: var(--margin) var(--margin-lg);
    transform: translateY(100%);
    transition: transform var(--transition-time) ease-out;

    &.active {
      transform: translateY(0%);
    }

    > a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--color-font);
      min-width: 63px;
      font-weight: 500;

      &:first-child {
        > svg {
          border-radius: 99px;
        }
      }

      > svg {
        width: 24px;
        height: 24px;
        min-height: 24px;
      }

      > span {
        display: inline-block;
        margin-top: 2px;
        font-size: var(--font-size-xs);
        font-weight: 500;
        line-height: 1.2;
      }

      &.router-link-active,
      &:active,
      &:focus {
        outline: none;
        color: var(--color-primary-light);
      }
    }
  }

  @supports (-webkit-touch-callout: none) {
    &__mobile {
      padding-bottom: var(--spacer);
    }
  }
}

.is-ios .c-mobile-footer {
  height: 76px;
  align-items: flex-start;
  padding-top: var(--margin-lg);
}
</style>
