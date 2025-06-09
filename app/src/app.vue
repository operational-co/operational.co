<template>
  <div :class="['c-app', { 'is-ios': isIOS === true }, { test: testMode === true }]" v-if="appInit">
    <!-- <Glow></Glow> -->

    <DemoBlurb :active="showDemoBlurb" @onClose="showDemoBlurb = false"></DemoBlurb>

    <!-- <Blurb v-if="!isPaying"></Blurb> -->

    <!-- <TestMode></TestMode> -->

    <Header v-if="isAuth"></Header>

    <MobileFooter v-if="isAuth"></MobileFooter>

    <!-- <Sidebar v-if="isAuth"></Sidebar> -->

    <div class="c-app__body">
      <router-view v-if="isAuth" v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </router-view>
    </div>

    <ModalsContainer></ModalsContainer>
    <ModalSetup :active="showSetup"></ModalSetup>
    <ModalLogin :active="showLogin"></ModalLogin>
    <ModalOnboarding :active="showOnboarding"></ModalOnboarding>
    <ModalDocs :active="showDocs"></ModalDocs>
    <ModalPermission
      :active="showPermissionModal"
      @onClose="$store.app.setPermissionModal(false)"
    ></ModalPermission>
    <ModalPwa :active="showPwaModal" @onClose="$store.app.setPwaModal(false)"></ModalPwa>
    <ModalActivation :active="showActivation" @onClose="showActivation = false"></ModalActivation>
    <ModalSwitchWorkspace
      :active="showSwitchWorkspace"
      @onClose="showActivation = false"
    ></ModalSwitchWorkspace>
    <ModalCreateWorkspace
      :active="showCreateWorkspace"
      @onClose="$store.app.setCreateWorkspace(false)"
    ></ModalCreateWorkspace>
    <ModalPaymentStarted
      :active="showPaymentStarted"
      @onClose="showPaymentStarted = false"
    ></ModalPaymentStarted>
    <ModalDeactivated
      :active="showDeactivated"
      @onClose="showDeactivated = false"
    ></ModalDeactivated>
    <Message></Message>
  </div>
</template>

<script>
import { ModalsContainer } from "vue-final-modal";
import Glow from "@/components/app/glow.vue";
import Header from "@/components/app/header.vue";
import MobileFooter from "@/components/app/mobile-footer.vue";
import Sidebar from "@/components/sidebar/index.vue";
import ModalSetup from "@/components/app/modal-setup.vue";
import ModalLogin from "@/components/app/modal-login.vue";
import ModalDocs from "@/components/app/modal-docs.vue";
import ModalOnboarding from "@/components/onboarding/modal-onboarding.vue";
import ModalPermission from "@/components/app/modal-permission.vue";
import ModalPwa from "@/components/app/modal-pwa.vue";
import ModalActivation from "@/components/app/modal-activation.vue";
import ModalSwitchWorkspace from "@/components/app/modal-switch-workspace.vue";
import ModalCreateWorkspace from "@/components/app/modal-create-workspace.vue";
import ModalPaymentStarted from "@/components/app/modal-payment-started.vue";
import ModalDeactivated from "@/components/app/modal-deactivated.vue";
import Message from "@/components/message/index.vue";
import TestMode from "@/components/app/test-mode.vue";
import Blurb from "@/components/app/blurb.vue";
import DemoBlurb from "@/components/app/demo-blurb.vue";

import Nprogress from "@/lib/nprogress.js";

import { setTestMode } from "@/lib/http.js";

import UAParser from "@/lib/ua-parser.js";

import posthog from "posthog-js";

export default {
  components: {
    Glow,
    Header,
    MobileFooter,
    Sidebar,
    ModalsContainer,
    ModalSetup,
    ModalLogin,
    ModalDocs,
    ModalOnboarding,
    ModalPermission,
    ModalOnboarding,
    ModalActivation,
    ModalSwitchWorkspace,
    ModalCreateWorkspace,
    ModalPaymentStarted,
    ModalDeactivated,
    ModalPwa,
    Message,
    TestMode,
    Blurb,
    DemoBlurb,
  },

  data: function () {
    return {
      nprogress: null,
      displayMode: "browser tab",
      showActivation: false,
      showPaymentStarted: false,
      showDeactivated: false,
      showDemoBlurb: false,

      allowSetup: false,
    };
  },

  watch: {
    appInit: function () {
      // Basically headless login worked
      if (this.isAuth) {
        this.afterLogin();
      }
    },
    isAuth: function () {
      if (this.appInit && this.isAuth) {
        this.afterLogin();
      }
      if (this.appInit && !this.isAuth) {
        this.afterLogout();
      }
    },
    loading: function () {
      if (this.loading) {
        this.nprogress.start();
      } else {
        this.nprogress.done();
      }
    },
    testMode: {
      handler: function () {
        setTestMode(this.testMode);
      },
      immediate: true,
    },
    isDemo: function () {
      if (this.isDemo) {
        this.$nextTick(() => {
          this.showDemoBlurb = true;
        });
      }
    },
  },

  computed: {
    isSelfHosted: function () {
      const condition = this.$store.app.isSelfHosted;
      return condition;
    },
    isPaying() {
      if (!this.workspace) {
        return null;
      }
      if (this.workspace.status !== "TRIAL" && this.workspace.paymentStartedAt) {
        return true;
      }

      return false;
    },
    user: function () {
      return this.$store.user.resource;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    showPermissionModal: function () {
      return false; // only temporarily
      return this.$store.app.permissionModal;
    },
    showPwaModal: function () {
      return this.$store.app.pwaModal;
    },
    showSwitchWorkspace: function () {
      return this.$store.app.switchWorkspace;
    },
    showCreateWorkspace: function () {
      return this.$store.app.createWorkspace;
    },
    testMode: function () {
      return this.$store.app.testMode;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    showOnboarding: function () {
      return this.$store.app.onboarding;
    },
    showDocs: function () {
      return this.$store.app.docs;
    },
    appInit: function () {
      return this.$store.app.appInit;
    },
    isAuth: function () {
      return this.$store.user.isAuth;
    },
    showSetup: function () {
      if (!this.appInit) {
        return false;
      }

      if (!this.isAuth && this.isSelfHosted && this.allowSetup) {
        return true;
      }

      return false;
    },
    showLogin: function () {
      if (!this.appInit) {
        return false;
      }

      if (!this.isAuth && !this.isSelfHosted) {
        return true;
      }

      if (!this.isAuth && this.isSelfHosted && !this.allowSetup) {
        return true;
      }

      return false;
    },
    loading: function () {
      return this.$store.app.loading;
    },
    isDemo: function () {
      return this.$store.workspace.isDemo;
    },
    isIOS: function () {
      return this.$store.app.isIOS;
    },
    vapidPublicKey: function () {
      return this.$store.app.vapidPublicKey;
    },
  },

  methods: {
    async init() {
      this.$store.app.setLoading(true);

      await this.$store.app.init();

      this.$store.app.setLoading(false);
    },
    async afterLogout() {
      if (typeof $crisp !== "undefined") {
        $crisp.push(["do", "chat:hide"]);
      }

      // Also redirect to home
      this.$router.push("/");

      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();
          await this.$store.app.unsubscribePush(subscription);
          console.log("User unsubscribed from push notifications");
        }
      }
    },
    // run this fx after login, and after headless login
    async afterLogin() {
      // activate crisp, whether afterlogin or aftersignup, doesn't matter
      if (typeof $crisp !== "undefined") {
        if (!this.isSelfHosted) {
          $crisp.push(["do", "chat:show"]);
        } else {
          $crisp.push(["do", "chat:hide"]);
        }
      }

      this.registerServiceWorker();

      if (!this.user.activated || !this.user.onboarded) {
        this.afterSignup();
        return;
      }

      // not used anymore
      const parser = new UAParser(navigator.userAgent);
    },
    async afterSignup() {
      this.$store.app.startOnboarding();
    },
    async checkConnection() {
      if (!this.isSelfHosted) {
        return;
      }
      try {
        const data = await this.$store.app.checkConnection();
        if (data) {
          this.allowSetup = true;
        }
      } catch (err) {
        if (err && err.message && err.message === "Already connected") {
          //hmm
        }
        if (err && err.message && err.message === "No response received from the server.") {
          // let it allow setup. the setup workflow will help user debug this issue
          this.allowSetup = true;
        }
        if (
          err &&
          err.message &&
          err.message ===
            `SECRET is missing. Set the SECRET="random_string" env var inside /backend and restart the server`
        ) {
          // let it allow setup. the setup workflow will help user debug this issue
          this.allowSetup = true;
        }
      }
    },
    onVisibilityChange: function () {
      if (document.visibilityState === "visible") {
        //this.$store.app.sendNotification(`Document visible!`);
      }
    },
    checkActivationCode: function () {
      // Don't do this if user is logged in and has already been activated
      if (this.user && this.user.activated) {
        return;
      }
      // If user hasn't been onboarded, the onboarding process will take care of this
      if (this.user && !this.user.onboarded) {
        return;
      }
      let route = this.$route;

      if (!route.query) {
        return;
      }

      if (!route.query.code) {
        return;
      }

      let code = route.query.code;

      this.showActivation = true;
    },
    checkPaymentStarted: function () {
      let route = this.$route;

      if (!route.query) {
        return;
      }

      if (!route.query.confirm || !route.query.setup_intent) {
        return;
      }

      this.showPaymentStarted = true;
    },
    checkDeactivation: function () {
      if (this.workspace && this.workspace.status === "DEACTIVATED") {
        this.showDeactivated = true;
      }
    },
    checkDemoUser: function () {
      let route = this.$route;

      if (!route.query) {
        return;
      }

      if (!route.query.signinas) {
        return;
      }

      this.$store.app.sendNotification(`Hang on.. activating demo!`);

      this.$store.user.attemptDemoLogin(route.query.signinas);
    },
    toggleDocs: function () {
      if (this.showDocs) {
        this.$store.app.hideDocs();
      } else {
        this.$store.app.showDocs();
      }
    },
    handleKeyDown(event) {
      // Check if the pressed key is the backtick key (`` ` ``)
      if (event.key === "`") {
        this.toggleDocs();
      }
    },
    arrayBufferToBase64(buffer) {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    },
    arrayBufferToBase64Url(buffer) {
      const base64 = this.arrayBufferToBase64(buffer); // from earlier
      // Convert to base64url
      return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    },
    async registerServiceWorker() {
      console.log("registering service worker");
      let logs = [];
      logs.push(`[Push] Registering subscription`);

      const applicationServerKey = this.vapidPublicKey;
      logs.push(`[Push] Application server key: ${applicationServerKey}`);

      // register serviceworker
      if (!("serviceWorker" in navigator)) {
        logs.push(`[Push] No serviceWorker. Push won't work`);
        console.log(logs);
        return;
      }

      this.$store.app.registration = await navigator.serviceWorker
        .register("/service-worker.js")
        .catch((err) => {
          logs.push(`[Push] Service worker registration failed`);
          this.$store.app.sendNotification(
            `Failed to setup service worker. Push notifications won't work.`,
          );
          console.log(err);
        });

      if (!this.$store.app.registration) {
        logs.push(`[Push] no registration found(odd!)`);
        console.log(logs);
        return;
      }

      logs.push(`[Push] Getting current subscription`);

      let subscription = await this.$store.app.registration.pushManager.getSubscription();

      if (subscription) {
        logs.push(`[Push] Subscription found, checking match against current server key`);
        const currentSubscriptionServerKey = this.arrayBufferToBase64Url(
          subscription.options.applicationServerKey,
        );
        if (currentSubscriptionServerKey !== applicationServerKey) {
          logs.push(`[Push] applicationServerKey mismatch, unsubscribing`);
          await subscription.unsubscribe();
        } else {
          logs.push(`[Push] applicationServerKey matches!`);
        }
      }

      if (!subscription) {
        logs.push(`[Push] Subscription not found, subscribing to subscription`);
        subscription = await this.$store.app.registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          })
          .catch((err) => {
            logs.push(`[Push] Couldn't subscribe. Err ${err}`);
            //this.$store.app.sendNotification(`ERROR 2 ${err}`);
            //console.log(err);
            //this.$store.app.setPermissionModal(true);
          });
        console.log(subscription);
      }

      if (!subscription) {
        logs.push(`[Push] no subscription attached`);
        console.log(logs);
        return;
      }

      //this.$store.app.sendNotification("SUBSCRIBED");

      logs.push(`[Push] Updating server with the subscription data`);

      this.$store.app.subscribePush(subscription);

      console.log(logs);
    },
    onDomContentLoaded: function () {
      let displayMode = "browser tab";
      if (window.matchMedia("(display-mode: standalone)").matches) {
        displayMode = "standalone";
      }
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        this.$store.app.isPwa = true;
      }
      this.$store.app.setDisplayMode(displayMode);
      this.displayMode = displayMode;

      console.log(`DISPLAY MODE: ${displayMode}`);
    },
    onMessage: function (e) {
      //console.log(`Message receivedzz`);
      //console.log(e);
    },
    onOnline: function () {
      this.$router.push("/");
      this.$store.app.setOffline(false);
    },
    onOffline: function () {
      this.$router.push("/offline");
      this.$store.app.setOffline(true);
    },
  },

  created: function () {
    const store = this.$store;

    this.$watch(
      () => store.app.notification,
      (newValue, oldValue) => {
        this.myStateProperty = newValue; // Update the component's data property
        // You can perform any actions you want with the new and old values here
      },
    );
  },

  mounted: function () {
    if (typeof $crisp !== "undefined") {
      $crisp.push(["do", "chat:hide"]);
    }

    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: "https://us.i.posthog.com",
        person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      });
    }

    this.checkConnection()
      .then(() => this.init())
      .then(() => {
        setTimeout(() => {
          this.checkActivationCode();
          this.checkPaymentStarted();
          this.checkDeactivation();
          this.checkDemoUser();
        }, 60);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (!this.nprogress) {
      this.nprogress = new Nprogress();
      this.nprogress.configure({ showSpinner: false });
    }

    window.addEventListener("message", this.onMessage);
    window.document.addEventListener("visibilitychange", this.onVisibilityChange);
    window.addEventListener("DOMContentLoaded", this.onDomContentLoaded);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("online", this.onOnline);
    window.addEventListener("offline", this.onOffline);
  },

  beforeDestroy: function () {
    window.removeEventListener("message", this.onMessage);
    window.document.removeEventListener("visibilitychange", this.onVisibilityChange);
    window.window.removeEventListener("DOMContentLoaded", this.onDomContentLoaded);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("online", this.onOnline);
    window.removeEventListener("offline", this.onOffline);
  },
};
</script>

<style lang="scss">
@import "@operational.co/styles/main";

// @font-face {
//  font-family: "iawriter";
//  src: url("/fonts/iawriter-quattro.woff2");
//  font-weight: 400 700;
//  font-style: normal;
//  font-display: swap;
// }

html {
  height: 100%;
}

body {
  overflow-x: hidden;
  height: 100%;

  #app {
    height: 100%;
  }
}

.c-app {
  height: 100%;

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 90ms linear,
      transform 90ms cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }

  .fade-slide-enter {
    opacity: 0;
  }
  .fade-slide-leave-to {
    opacity: 0;
  }
  .fade-slide-enter-to {
    opacity: 1;
  }
  .fade-slide-enter-from {
    opacity: 0;
  }
  .fade-slide-leave {
    opacity: 1;
  }
  .fade-slide-leave-to {
    transform: translateX(4px);
  }
  .fade-slide-enter-from,
  .fade-slide-leave {
    transform: translateX(0);
  }

  &__body {
    height: calc(100% - 56px);
    position: relative;
    isolation: isolate;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: hsl(var(--hue-p), 6%, 18%);
      border-radius: 0;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--hue-p), 6%, 18%);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  @media screen and (max-width: 576px) {
    &__body {
      height: calc(100% - 100px); // 56 + 44 (footer + header)
      padding-bottom: calc(64px + var(--margin-lg));
    }
  }
}

@import "vue-final-modal/style.css";
</style>
