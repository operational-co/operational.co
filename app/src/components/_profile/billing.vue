<template>
  <div class="c-profile-billing">
    <h3>Billing</h3>
    <p>Manage your payment details here.</p>

    <section>
      <h3>Payment method</h3>
      <p>No payment method entered. Please enter a payment method to continue using Operational.</p>
      <div id="address-element"></div>
      <div id="payment-element"></div>

      <button class="btn btn-primary btn-wide" @click="onSubmit">Update payment method</button>
    </section>

    <section>
      <Invoices></Invoices>
    </section>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { userApi } from "@/store/user.js";

import Invoices from "./invoices.vue";

export default {
  components: {
    Invoices,
  },

  data: function () {
    return {
      stripe: null,
      elements: null,
      paymentElement: null,
      addressElement: null,
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
        "pk_test_51PQiaPHAmTbxyIefltJ5lgxoYM0wEfCRU4OhDSH2HfdBty6ld71w0jIjwemoMuLKto4ERQu65fV97J6gEocJ2d3000IqXsLFTr"
      );

      const appearance = {
        theme: "night",
      };
      const addressOptions = {
        mode: "billing",
      };

      const paymentOptions = {};

      this.elements = this.stripe.elements({ appearance, mode: "setup", currency: "usd" });
      this.paymentElement = this.elements.create("payment", paymentOptions);
      this.addressElement = this.elements.create("address", addressOptions);
      this.addressElement.mount("#address-element");
      this.paymentElement.mount("#payment-element");
    },
    async onSubmit() {
      let result = await this.elements.submit();

      const payload = await userApi.createIntent().catch((err) => {
        console.log(err);
      });

      console.log(payload);

      if (!payload) {
        return;
      }

      if (!payload.client_secret) {
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
    },
  },

  mounted: function () {
    this.stripeInit();
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
  }

  #payment-element {
    margin-bottom: var(--margin-lg);
  }

  @media screen and (max-width: 576px) {
    section {
      padding: var(--spacer-sm);
    }
  }
}
</style>
