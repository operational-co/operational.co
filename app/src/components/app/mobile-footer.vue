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

    <router-link to="/docs">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 14H13M9 10H15M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>

      <span> Docs </span>
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
}
</style>
