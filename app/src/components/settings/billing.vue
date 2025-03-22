<template>
  <div class="c-profile-billing">
    <template v-if="loaded">
      <!-- Show this if no payment information is entered -->
      <section v-if="!setupIntent">
        <h4>Payment method</h4>
        <p>
          No payment method entered. Please enter a payment method to continue
          using Operational.
        </p>
        <div id="address-element"></div>
        <div id="payment-element"></div>

        <button
          :disabled="processing"
          class="btn btn-primary btn-wide"
          @click="onSubmit"
        >
          <span v-if="processing" class="c-spinner"> </span>
          <span> Update payment method </span>
        </button>
      </section>

      <!-- Show this if payment information has been collected -->
      <section v-if="setupIntent">
        <article>
          <p>Your billing details have been collected.</p>
          <p>
            As a usage-based platform, Operational bills you only for what you
            use each month. At the end of every billing cycle, we’ll
            automatically charge your payment method based on your final usage
            totals and send you an invoice for review.
          </p>
          <p>
            If you have any questions, please don’t hesitate to reach out via
            the in-app support chat.
          </p>
        </article>
        <template v-if="!currentView">
          <Card
            v-for="paymentMethod in paymentMethods"
            :key="paymentMethod.id"
            :paymentMethod="paymentMethod"
          >
            <button class="btn">Default</button>
          </Card>
          <a href="#" @click.prevent="currentView = 'update'">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 14V17M19 17V20M19 17H16M19 17H22M3 10V17C3 18.1046 3.89527 19 4.99984 19H12M3 10V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89518 21 6.99975V10H3Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <article>
              <h5>Add new Card</h5>
              <p>This will replace your existing credit card.</p>
            </article>
          </a>
          <a href="#" @click.prevent="currentView = 'cancel'">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 15H15M13.7197 7.53033L12 9.25M12 9.25L10.2803 10.9697M12 9.25L10.2803 7.53033M12 9.25L13.7197 10.9697M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21L7.33333 19L9.66667 21L12 19L14.3333 21L16.6667 19L19 21Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <article>
              <h5>Cancel subscription</h5>
              <p>
                This will bill you for your existing events for this month and
                your payment details will be removed from our system after this.
              </p>
            </article>
          </a>
        </template>
        <template v-if="currentView === 'update'">
          <span class="back-button" @click.prevent="currentView = null"
            >Cancel</span
          >
          <p>Enter new card details.</p>
          <p>
            This will remove your old card details and we'll use your new card
            for payments.
          </p>
        </template>
        <template v-if="currentView === 'cancel'">
          <span class="back-button" @click.prevent="currentView = null"
            >Cancel</span
          >
          <p>Cancel your payment plan</p>
          <p>
            Upon filling out this form, you will be charged for your current
            usage for this month and your payment details will be removed from
            our system.
          </p>
          <FormUnsubscribe></FormUnsubscribe>
        </template>
      </section>
    </template>

    <!-- <section>
      <Invoices></Invoices>
    </section> -->
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { userApi } from "@/store/user.js";

import Invoices from "./invoices.vue";

import FormUnsubscribe from "@operational.co/components/form/form-unsubscribe.vue";

import Card from "./card.vue";

export default {
  components: {
    Invoices,
    FormUnsubscribe,
    Card,
  },

  data: function () {
    return {
      stripe: null,
      elements: null,
      paymentElement: null,
      addressElement: null,

      processing: false,

      setupIntent: null,

      paymentMethods: [],

      loaded: false,

      currentView: null,
    };
  },

  computed: {
    user: function () {
      return this.$store.user.resource;
    },
    users: function () {
      if (!this.user) {
        return [];
      }

      return this.user.users || [];
    },
  },

  methods: {
    async stripeInit() {
      this.stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      );

      const appearance = {
        theme: "night",
      };
      const addressOptions = {
        mode: "billing",
      };

      const paymentOptions = {};

      this.elements = this.stripe.elements({
        appearance,
        mode: "setup",
        currency: "usd",
      });
      this.paymentElement = this.elements.create("payment", paymentOptions);
      this.addressElement = this.elements.create("address", addressOptions);
      this.addressElement.mount("#address-element");
      this.paymentElement.mount("#payment-element");
    },
    async onSubmit() {
      this.processing = true;

      let result = await this.elements.submit();

      const payload = await userApi.createIntent().catch((err) => {
        console.log(err);
      });

      console.log(payload);

      if (!payload) {
        this.processing = false;
        return;
      }

      if (!payload.client_secret) {
        this.processing = false;
        return;
      }

      const clientSecret = payload.client_secret;

      const setup = await this.stripe.confirmSetup({
        elements: this.elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:8080?confirm=true`,
        },
      });
      console.log(setup);

      this.processing = false;
    },
    async loadSetupIntent() {
      this.loaded = false;
      let billingData = await userApi.getBillingData();

      let setupIntents = billingData.setupIntents;
      let paymentMethods = billingData.paymentMethods;
      console.log(setupIntents);

      this.loaded = true;

      if (paymentMethods && paymentMethods.data.length > 0) {
        this.paymentMethods = paymentMethods.data;
      }

      if (setupIntents && setupIntents.data.length > 0) {
        this.setupIntent = setupIntents.data[0];
      } else {
        this.stripeInit();
      }
    },
  },

  mounted: function () {
    this.loadSetupIntent();
  },
};
</script>

<style lang="scss">
.c-profile-billing {
  section {
    background-color: var(--color-bg-3);
    padding: var(--spacer);
    border-radius: var(--border-radius-lg);

    &:not(:last-of-type) {
      margin-bottom: var(--spacer);
    }

    article {
      max-width: 500px;
    }

    a {
      display: grid;
      grid-template-columns: 32px 1fr;
      align-items: center;
      padding: var(--margin);
      background-color: var(--color-bg-3);
      border-radius: var(--border-radius);
      text-decoration: none;
      color: var(--color-font);

      h5 {
        margin-bottom: 0;
        font-size: var(--font-size);
      }

      p {
        margin-bottom: 0;
      }

      &:not(:last-child) {
        margin-bottom: 1rem;
      }

      &:hover,
      &:active {
        background-color: var(--color-bg-4);
      }
    }
  }

  #payment-element {
    margin-bottom: var(--margin-lg);
  }

  .back-button {
    padding-top: 1rem;
    padding-bottom: 1rem;
    position: relative;
    display: block;
    font-weight: 500;
    font-size: var(--font-size-sm);
    text-decoration: underline;
    cursor: pointer;
    user-select: none;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: var(--color-bg-4);
    }
  }

  @media screen and (max-width: 576px) {
    section {
      padding: var(--spacer-sm);
    }
  }
}
</style>
