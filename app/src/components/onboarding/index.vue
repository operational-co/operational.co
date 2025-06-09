<template>
  <div class="c-onboarding">
    <component :is="resolveStep(currentStep)" @onNext="onNext"></component>
    <section class="c-onboarding__flags">
      <span v-for="(step, i) in steps" :key="i" :class="[{ active: step === currentStep }]"> </span>
    </section>
  </div>
</template>

<script>
import Activation from "./activation.vue";
import Intro from "./intro.vue";
import Apikey from "./apikey.vue";
import Notification from "./notification.vue";
import Event from "./event.vue";
import Event2 from "./event2.vue";
import Project from "./project.vue";
import Pwa from "./pwa.vue";
import Stats from "./stats.vue";
import Support from "./support.vue";
import Outro from "./outro.vue";

import Setup from "./setup.vue";
import Setup2 from "./setup2.vue";

import Invitee from "./invitee.vue";

export default {
  components: {
    Activation,
    Intro,
    Apikey,
    Notification,
    Event,
    Event2,
    Project,
    Pwa,
    Stats,
    Support,
    Outro,

    Setup,
    Setup2,

    Invitee,
  },

  data: function () {
    return {
      currentStep: "intro",
      steps: [
        "activation",
        "intro",
        "project",
        "pwa",
        "stats",
        //"apikey",
        //"event",
        //"event2",
        //"notification",
        //"support",
        //"outro",
      ],

      setupSetups: ["setup", "pwa", "setup2"],

      inviteeSteps: ["invitee"],
    };
  },

  computed: {
    user: function () {
      return this.$store.user.resource;
    },
    isSelfHosted: function () {
      const condition = this.$store.app.isSelfHosted;
      return condition;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    users: function () {
      if (!this.workspace) {
        return [];
      }

      let users = this.workspace.users || [];

      users.reverse();

      return users;
    },

    // if the current user isn't a admin, assume they are a invitee
    isInvitee: function () {
      let user = this.user;

      if (this.workspace && this.workspace.adminId !== this.user.id) {
        return true;
      }

      return false;
    },
  },

  methods: {
    async updateUser(step) {
      let form = {
        onboardingStep: step,
      };

      let user = await this.$store.user.update(form);
    },
    resolveStep: function (step) {
      return step.toLowerCase();
    },
    onNext: function () {
      let newStep = null;
      let steps = this.steps;
      if (this.isSelfHosted) {
        steps = this.setupSetups;
      }
      if (this.isInvitee) {
        steps = this.inviteeSteps;
      }

      let i = steps.indexOf(this.currentStep);

      if (i !== -1) {
        newStep = steps[i + 1];

        if (!newStep) {
          //this.$store.app.sendNotification(`You're onboarded`);
          this.$store.app.stopOnboarding();
          this.$store.user.finishOnboarding();
          return;
          // close onboarding
        }

        this.currentStep = newStep;

        this.updateUser(newStep);
      }
    },
  },

  mounted: function () {
    let onboardingStep = this.user.onboardingStep;

    let steps = this.steps;
    if (this.isSelfHosted) {
      steps = this.setupSetups;
    }

    if (this.isInvitee) {
      steps = this.inviteeSteps;
      onboardingStep = "invitee";
    }

    console.log(this.isInvitee);

    console.log(steps);

    // If user hasn't been activated, force them to finish their activation
    if (!this.user.activated) {
      onboardingStep = "activation";
    }

    if (onboardingStep) {
      let i = steps.indexOf(onboardingStep);

      if (i >= 0) {
        this.currentStep = steps[i];
      }
    }
  },
};
</script>

<style lang="scss">
.c-onboarding {
  height: 60vh;
  position: relative;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 99px;
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

  code.one-line {
    border-radius: var(--border-radius);
    font-size: var(--font-size-sm);
    background-color: var(--color-bg-3);
  }

  > div {
    min-height: 100%;
    padding: 2rem;
    display: flex;
    align-items: center;
  }

  .c-constrain {
    height: 100%;
    width: 100%;

    &__inner {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      > article {
        width: 100%;
      }
    }
  }

  &__flags {
    position: relative;
    bottom: 0;
    //left: 50%;
    bottom: 1px;
    //transform: translateX(-50%);
    height: auto !important;
    min-height: initial !important;
    padding: var(--spacer);
    padding-top: 0;

    display: flex;
    justify-content: center;
    display: none;

    span {
      width: 32px;
      height: 8px;
      margin: 0 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-bg-4);
      border-radius: 99px;
      opacity: 0.5;
      user-select: none;

      &.active {
        opacity: 1;
        background-color: var(--color-bg-5);
      }
    }
  }

  @media screen and (max-width: 1500px) {
    height: calc(100vh - 8rem);
  }
}
</style>
