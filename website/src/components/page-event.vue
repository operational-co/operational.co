<template>
  <div class="p-event">
    <Constrain>
      <div class="p-event__inner">
        <article>
          <h1>Introducing Operational Event logger</h1>
          <p>Howdy, I'm Shash and I run a SaaS business.</p>
          <p>
            Like many fouders, I want to get notified when key events happened, eg a user signed up, a user onboarded,
            someone cancelled their subscription, a cron job failed, a 3rd party integration failed, etc.
          </p>
          <p>These were small issues but they grew day-by-day and kept me away from working on my biz.</p>
          <p>
            All I wanted was a webapp where I can receive notifications, send triggers to my server based on these
            notifications, and give me a high level understanding of what's happening in my product.
          </p>
          <p>And so I created Operational.</p>
          <h2>What is Operational?</h2>
          <p>
            At a high level, Operational is a simple event logging SaaS. You push some events via our api and you can
            see these events in our UI:
          </p>
          <Item :item="test1"></Item>
          <p>Where Operational really shines is what you can do with these events.</p>
          <h2>1. Structured events</h2>
          <p>
            Event logging is all fine and dandy but what if a user signed up and you want to understand what email did
            they sign up with, what's their ip, did they came in with a referral, etc.
          </p>
          <p>With Operational, you can pass a structured object and it will render a beautiful event log.</p>
          <Item :item="test2"></Item>
          <h2>2. Actions</h2>
          <p>
            Next step up is to run 'actions' on events. For instance, if a high value user unsubscribes from your SaaS,
            you can send a structured event detailing what they did, and pass an array of 'actions'.
          </p>
          <p>
            These actions are rendered as buttons inside Operational. When clicked, they send a webhook to your server
            where you can make your server send an email to this user asking them what can you do to retain them.
          </p>
          <Item :item="test3"></Item>
          <h2>3. Contexts</h2>
          <p>
            Lastly, you might want to track complex user flows or cron jobs. You can of course send individual events,
            eg: user did part 1 of onboarding, user did part 2 of onboarding, etc. But timeline wise these events often
            get mixed up with other events.
          </p>
          <p>
            With contexts you can group together events, thereby helping you understand the context in with the events
            took place.
          </p>
          <Item :item="test4"></Item>
          <h2>There's more</h2>
          <p>
            With Operational I wanted to make something that founders can use on the go. I understand the pain point of
            getting an email/chat support ticket when you're on the go and having to open your laptop, open up
            phpmyadmin or something similar and update a flag in the db.
          </p>
          <p>
            Operational's entire UI is made to run on your mobile device flawlessly. This happens because Operational is
            a PWA(Progressive web app).
          </p>
          <p>
            Don't know what that means? That's fine, the Operational webapp can be 'installed' on your device and it
            will work like a normal app after that.
          </p>

          <p>
            This also means you will receive push notifications on iOS and android. The entire UI is also optimized for
            mobile too. Buttons have a nice tactile feeling, navs and headers look closer to their native counter parts,
            and so on.
          </p>
          <p>
            And darn I say it looks pretty. Since you're going to be viewing events every day, we have made the webapp
            look as pretty as possible - without sacrifing user experience.
          </p>
          <p>For instance:</p>
          <ul>
            <li>Dates are formatted in a human readable form - no iso8601 bs here.</li>
            <li>Confused by utc dates? We are too. All dates are relative to your timezone(and configurable too)</li>
            <li>
              Going on a hike and don't want to receive push notifications? We got you(notifications can be turned off
              through the webapp)
            </li>
            <li>
              Can't sleep at night and want to see what your app is doing? Operational has a dark theme by default so
              its easier on your eyes when you roll in your bed.
            </li>
          </ul>
          <h2>Where can you use Operational</h2>
          <p>Here are some uses cases:</p>
          <ul>
            <li>Audit logs - track all major user activity for kyc purposes</li>
            <li>Get notified who signed up - run action here to ban bad actors or other nefarious users.</li>
            <li>
              Get notified when someone's trial ends - run action here to allow trial extension if user seems to be high
              value.
            </li>
            <li>Get notified when someone unsubscribes - run action here to ask them why they are leaving.</li>
          </ul>
          <p>
            And so on. Ultimately you want to send events based on your needs. The best events are the ones that solve
            business-specific issues.
          </p>
          <h2>Why use Operational?</h2>
          <p>
            Operational is in the beta phase right now. Which means that it is usable (We uses this in production) but
            we might alter a few things before going live.
          </p>
          <p>
            A big part of why you should sign up for beta products comes down to the founder's track record. Here's
            mine:
          </p>
          <ul>
            <li>This is not my first rodeo. I've already built a SaaS before(Swipekit)</li>
            <li>Operational is fully bootstrapped and we're using it in production.</li>
          </ul>
          <h2>How to signup?</h2>
          <p>
            Currently Operational is referral only. Which means that unless an existing user refers you, there's no way
            to signup.
          </p>
          <p>
            This is intentional because we want to onboard users who can really resonate with the pain points
            Operational is solving, and are willing to provide feedback.
          </p>
          <h2>Pricing</h2>
          <p>Operational is currently in beta, and as such it is free. We will have a paid plan once we're ready.</p>
          <p>
            We haven't nailed our price but we're going to have a pay-per-event model. This is great because the smaller
            your biz - the less you pay, making it great for early stage bootstrapped companies.
          </p>
          <p>
            We also have a dedicated test mode where we don't charge for events. Perfect for integrating Operational in
            your product.
          </p>
          <p>
            Our target pricing is between $5 - $15 usd per month based on events generated for a $5k MRR SaaS having
            ~200 users and getting 50 signups every day.
          </p>
        </article>
      </div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Item from "@operational.co/components/card/index.vue";

export default {
  components: {
    Constrain,
    Item,
  },

  data: function () {
    let date = new Date();

    return {
      route: null,
      users: [],
      query: "",
      test1: {
        id: 1,
        createdAt: date,
        name: "User signed up",
      },
      test2: {
        id: 2,
        createdAt: date,
        type: "rows",
        name: "User signed up",
        avatar: "👋",
        content: [
          {
            type: "text",
            label: "Email",
            content: "derrick@savvycal.com",
          },
          {
            type: "text",
            label: "IP",
            content: "6.6.6.6",
          },
          {
            type: "text",
            label: "Website",
            content: "savvycal.com",
          },
          {
            type: "text",
            label: "Referral",
            content: "shash",
          },
        ],
      },
      test3: {
        id: 2,
        createdAt: date,
        type: "rows",
        name: "User signed up",
        avatar: "👋",
        content: [
          {
            type: "text",
            label: "Email",
            content: "shash@gmail.com",
          },
          {
            type: "text",
            label: "IP",
            content: "6.6.6.6",
          },
          {
            type: "text",
            label: "Referral",
            content: "shash",
          },
        ],
        actions: [
          {
            url: "https://savvycal.com",
            external: true,
            buttonText: "Website",
          },
          {
            url: "https://webhook.site",
            buttonText: "Ban user",
          },
        ],
      },
      test4: {
        id: 1,
        createdAt: date,
        name: "cron: stack created",
        contextId: 1,
        contextType: 1,
        contexts: [
          {
            id: 2,
            contextType: 2,
            name: "cron: processing stack",
            createdAt: date,
          },
          {
            id: 3,
            contextType: 2,
            name: "cron: error",
            content: "ID: 343t546314",
            createdAt: date,
          },
          {
            id: 3,
            contextType: 2,
            name: "cron: error",
            content: "ID: 343t546314",
            createdAt: date,
          },
          {
            id: 3,
            contextType: 2,
            name: "cron: stack processed",
            content: "ID: 343t546314",
            createdAt: date,
          },
        ],
      },
    };
  },

  computed: {},
};
</script>

<style lang="scss">
.p-event {
  padding-bottom: var(--spacer);

  &__inner {
    padding: 0 var(--margin-lg);

    > article {
      margin: var(--spacer) 0;
    }
  }

  .c-card {
    margin-bottom: 1rem;
  }

  h2,
  h3 {
    margin-top: var(--spacer);
  }

  @media screen and (max-width: 520px) {
  }
}
</style>
