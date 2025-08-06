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
        <router-link to="/"> Events </router-link>
        <router-link to="/settings"> Settings </router-link>
        <router-link to="/playground"> Playground </router-link>
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
