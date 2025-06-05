<template>
  <Modal klass="m-login" type="full" :active="active">
    <Constrain size="xs">
      <div class="m-login__header">
        <article>
          <h1>Operational.co</h1>
          <span v-if="subtitleText">{{ subtitleText }}</span>
        </article>
      </div>

      <div class="m-login__body" v-if="currentTab === 'login'">
        <FormLogin></FormLogin>
        <section>
          <p v-if="!isSelfHosted">
            Not a member yet?
            <a href="#" @click.prevent="currentTab = 'signup'">Signup now</a>
          </p>
          <p>
            Forgot your password?
            <a href="#" @click.prevent="currentTab = 'resetpassword'">Reset it now</a>
          </p>
        </section>
      </div>

      <div class="m-login__body" v-if="currentTab === 'signup'">
        <FormSignup></FormSignup>
        <hr />
        <section>
          <p>
            Already a member?
            <a href="#" @click.prevent="currentTab = 'login'">Log in now</a>
          </p>
        </section>
      </div>

      <div class="m-login__body" v-if="currentTab === 'resetpassword'">
        <FormResetPasswordRequest @onSubmit="onResetPasswordRequest"></FormResetPasswordRequest>
        <section>
          <p>
            Already a member?
            <a href="#" @click.prevent="currentTab = 'login'">Sign in now</a>
          </p>
        </section>
      </div>

      <!-- <div class="m-login__footer">
        <a href="#"> Terms</a>
        <span> •</span>
        <a href="#"> Privacy Policy</a>
      </div> -->
    </Constrain>
  </Modal>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Modal from "@operational.co/components/ui/modal.vue";
import FormLogin from "@operational.co/components/form/form-login.vue";
import FormSignup from "@operational.co/components/form/form-signup.vue";
import FormResetPasswordRequest from "@operational.co/components/form/form-reset-password-request.vue";
import InputCode from "@operational.co/components/form/input-code.vue";

export default {
  components: {
    Constrain,
    Modal,
    FormLogin,
    FormSignup,
    FormResetPasswordRequest,
    InputCode,
  },

  data: function () {
    return {
      currentTab: "signup",
      code: "",
    };
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
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
  },

  methods: {
    onResetPasswordRequest: function () {},
  },

  mounted: function () {
    // resolve currentTab here

    let route = this.$route;

    if (route.query && "login" in route.query) {
      this.currentTab = "login";
    } else {
    }

    if (this.isSelfHosted) {
      this.currentTab = "login";
    }

    if (this.active) {
      setTimeout(() => {
        const firstInput = document.querySelector("input");

        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  },
};
</script>

<style lang="scss">
.m-login {
  // .vfm__content {
  //   background-image: linear-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 2px),
  //     linear-gradient(to right, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  //   background-size: 128px 128px;
  // }

  .c-constrain {
    height: 100%;

    &__inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  &__body {
    width: 100%;
  }

  &__header {
    width: 100%;
    text-align: center;

    h1 {
      margin-bottom: 1rem;
    }

    span {
      display: inline-block;
      padding: var(--margin);
      margin-left: var(--margin);
      margin-bottom: 1rem;
      font-size: var(--font-size-sm);
      font-weight: 500;
      font-family: var(--font-family-monospace);
      line-height: 1;
      color: var(--color-font-light);
      background-color: var(--color-bg-2);
      border-radius: var(--border-radius);
    }
  }

  &__footer {
    width: 100%;
    text-align: center;

    font-size: var(--font-size-sm);
  }

  .c-form {
    margin-bottom: var(--margin-lg);
  }

  h1 {
    line-height: 1.1;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-color: linear-gradient(180deg, #fff 45%, rgba(255, 255, 255, 0.79));
    background-image: linear-gradient(180deg, #fff 45%, rgba(255, 255, 255, 0.79));
  }

  section {
    > p {
      font-weight: 500;
    }
  }

  .btn {
    width: 100%;
  }

  @media screen and (max-width: 576px) {
    .form-control {
      min-height: 44px;
      font-size: var(--font-size);
    }
    .btn {
      height: 44px;
    }
  }
}
</style>
