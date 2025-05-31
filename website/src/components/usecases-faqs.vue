<template>
  <div class="c-page-faqs">
    <Constrain>
      <div class="c-page-faqs__inner">
        <h2>Common questions</h2>
        <div class="c-page-faqs__list">
          <Accordion>
            <template #title>
              <h4>Is the 10,000 free events per month or one time?</h4>
            </template>
            <template #body>
              <p>
                10,000 free events are one time only. Once you track 10,000 events, you will be
                asked to enter your credit card details.
              </p>
            </template>
          </Accordion>
          <Accordion>
            <template #title>
              <h4>Do I need a credit card to signup?</h4>
            </template>
            <template #body>
              <p>No you don't. You can simply sign up and start tracking events right away.</p>
              <p>We will ask for your card details once you track over 10,000 events.</p>
            </template>
          </Accordion>
          <Accordion>
            <template #title>
              <h4>What happens if I don't enter my card details after my free events are up?</h4>
            </template>
            <template #body>
              <p>
                If you don't enter your card details after your free events are up, you will be
                given 5 day as a grace period to enter your card details.
              </p>
              <p>
                If you still haven't entered your card details, your account will be deactivated.
              </p>
            </template>
          </Accordion>
          <Accordion>
            <template #title>
              <h4>When will I get billed?</h4>
            </template>
            <template #body>
              <p>
                Billing happens on the 1st of every month. So if you enter your card details, you
                won't be charged right away, you will be charged on the 1st of next month for the
                events accumulated for the previous month.
              </p>
            </template>
          </Accordion>
          <Accordion>
            <template #title>
              <h4>Can I self-host Operational / Is Operational open-source?</h4>
            </template>
            <template #body>
              <p>Operational is planned to be open source in the near future.</p>
              <p>
                Right now, there is still a lot of work to be done, but once the code is stable, we
                will make our repo open-source and add guides for self-hosting.
              </p>
            </template>
          </Accordion>
          <Accordion>
            <template #title>
              <h4>How long are tracked events stored for?</h4>
            </template>
            <template #body>
              <p>Events are stored for at least 1 year.</p>
              <p>
                Since Operational is a brand new product, we haven't decided timelines for longer
                term retention.
              </p>
            </template>
          </Accordion>
        </div>
      </div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";
import Accordion from "./ui/accordion.vue";

export default {
  components: {
    Constrain,
    Subtitle,
    Accordion,
  },
};
</script>

<style lang="scss">
.c-page-faqs {
  &__inner {
    display: grid;
    grid-template-columns: 0.75fr 1.25fr;
    grid-column-gap: var(--spacer-sm);
    padding: var(--spacer-lg) 0;
  }
}
</style>
