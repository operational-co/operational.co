<template>
  <div :class="['c-page-cards', size]">
    <Constrain>
      <h2 class="h1">What makes Operational different?</h2>
      <div class="c-page-cards__inner">
        <div class="c-page-cards__card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12.7499 6.5C12.7499 6.08579 12.4141 5.75 11.9999 5.75C11.5857 5.75 11.2499 6.08579 11.2499 6.5V7.25H10.7433C9.36622 7.25 8.24988 8.36634 8.24988 9.74342C8.24988 10.8167 8.93664 11.7695 9.95481 12.1089L11.2499 12.5406V15.25H10.9999C10.3095 15.25 9.74988 14.6904 9.74988 14C9.74988 13.5858 9.41409 13.25 8.99988 13.25C8.58566 13.25 8.24988 13.5858 8.24988 14C8.24988 15.5188 9.48109 16.75 10.9999 16.75H11.2499V17.5C11.2499 17.9142 11.5857 18.25 11.9999 18.25C12.4141 18.25 12.7499 17.9142 12.7499 17.5V16.75H13.2565C14.6335 16.75 15.7499 15.6337 15.7499 14.2566C15.7499 13.1833 15.0631 12.2305 14.0449 11.8911L12.7499 11.4594V8.75H12.9999C13.6902 8.75 14.2499 9.30964 14.2499 10C14.2499 10.4142 14.5857 10.75 14.9999 10.75C15.4141 10.75 15.7499 10.4142 15.7499 10C15.7499 8.48122 14.5187 7.25 12.9999 7.25H12.7499V6.5ZM10.7433 8.75H11.2499V10.9594L10.4291 10.6859C10.0235 10.5506 9.74988 10.171 9.74988 9.74342C9.74988 9.19477 10.1946 8.75 10.7433 8.75ZM12.7499 15.25V13.0406L13.5706 13.3141C13.9763 13.4494 14.2499 13.829 14.2499 14.2566C14.2499 14.8052 13.8051 15.25 13.2565 15.25H12.7499Z"
              fill="currentColor"
            />
          </svg>
          <Subtitle subtitle="Fair Pricing"></Subtitle>
          <article>
            <p>
              Operational will have a pay-as-you-go model. So if you're just starting out, you will be paying literally
              a few bucks every month.
            </p>
            <p>Operational will also have volume discounts baked in - no need to talk to us!</p>
          </article>
        </div>

        <div class="c-page-cards__card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 5C4.13401 5 1 8.13401 1 12C1 15.866 4.13401 19 8 19H16C19.866 19 23 15.866 23 12C23 8.13401 19.866 5 16 5H8ZM8 8C5.79086 8 4 9.79086 4 12C4 14.2091 5.79086 16 8 16C10.2091 16 12 14.2091 12 12C12 9.79086 10.2091 8 8 8Z"
              fill="currentColor"
            />
          </svg>
          <Subtitle subtitle="Test mode baked in"></Subtitle>
          <article>
            <p>Remember how Stripe has an awesome test mode? Operational has it too!</p>
            <p>
              Use test mode to view test events, and keep your staging/development environment seperate from your
              production one.
            </p>
          </article>
        </div>

        <div class="c-page-cards__card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.29059 1.33018C5 1.879 5 2.60266 5 4.05V19.95C5 21.3973 5 22.121 5.29059 22.6698C5.52509 23.1127 5.88728 23.4749 6.33018 23.7094C6.879 24 7.60266 24 9.05 24H14.95C16.3973 24 17.121 24 17.6698 23.7094C18.1127 23.4749 18.4749 23.1127 18.7094 22.6698C19 22.121 19 21.3973 19 19.95V4.05C19 2.60266 19 1.879 18.7094 1.33018C18.4749 0.887281 18.1127 0.525086 17.6698 0.290586C17.121 0 16.3973 0 14.95 0H9.05C7.60266 0 6.879 0 6.33018 0.290586C5.88728 0.525086 5.52509 0.887281 5.29059 1.33018ZM9.5 1C9.22386 1 9 1.22386 9 1.5C9 2.05228 9.44772 2.5 10 2.5H14C14.5523 2.5 15 2.05228 15 1.5C15 1.22386 14.7761 1 14.5 1H9.5Z"
              fill="currentColor"
            />
          </svg>
          <Subtitle subtitle="PWA compatible"></Subtitle>
          <article>
            <p>
              Operational webapp can be installed as a app on your device. Once installed, it works exactly like a
              native app.
            </p>
            <p>
              Use Ops on the go. Ban a user while in the gym, activate someone's account during your commute, view
              cronjobs in your bed.
            </p>
          </article>
        </div>

        <div class="c-page-cards__card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.0556 1.25C12.1629 1.25 12.25 1.33706 12.25 1.44444V2.25C12.25 2.66421 12.5858 3 13 3C13.4142 3 13.75 2.66421 13.75 2.25V1.44444C13.75 1.33706 13.8371 1.25 13.9444 1.25H14.9485C16.6261 1.25 17.4649 1.25 18.1356 1.49765C19.2325 1.90271 20.0973 2.76747 20.5023 3.8644C20.75 4.53507 20.75 5.37389 20.75 7.05154C20.75 7.5741 20.75 7.83538 20.6813 8.09073C20.5759 8.48223 20.3048 8.8927 19.986 9.14327C19.7782 9.30669 19.5664 9.39707 19.1428 9.57781C18.9677 9.65254 18.7853 9.72809 18.5965 9.80364C16.7622 10.5373 14.3639 11.25 12 11.25C9.6361 11.25 7.2378 10.5373 5.40354 9.80364C5.21467 9.72809 5.03232 9.65254 4.85719 9.57781C4.43362 9.39707 4.22183 9.3067 4.01395 9.14327C3.69521 8.8927 3.42409 8.48223 3.31872 8.09073C3.25 7.83538 3.25 7.5741 3.25 7.05154V5.69444C3.25 5.28172 3.25 5.07536 3.26522 4.90138C3.43441 2.96759 4.96759 1.43441 6.90138 1.26522C7.07536 1.25 7.28172 1.25 7.69444 1.25H7.83333C8.06345 1.25 8.25 1.43655 8.25 1.66667V4.25C8.25 4.66421 8.58579 5 9 5C9.41421 5 9.75 4.66421 9.75 4.25V1.66667C9.75 1.43655 9.93655 1.25 10.1667 1.25H12.0556Z"
              fill="currentColor"
            />
            <path
              d="M3.68316 10.6997C3.67654 10.6967 3.67323 10.6952 3.67238 10.6948C3.47263 10.6055 3.25136 10.748 3.25001 10.9668C3.25 10.9678 3.25 10.9705 3.25 10.9761C3.25 10.9909 3.25 10.9982 3.25002 11.0051C3.25518 12.5103 4.1049 13.8852 5.44889 14.5629C5.45501 14.566 5.46162 14.5693 5.47484 14.5759L6.96115 15.3191C8.27357 15.9753 9.00068 17.4338 8.75946 18.8812C8.42509 20.8874 9.96613 22.75 12 22.75C14.0339 22.75 15.5749 20.8874 15.2405 18.8812C14.9993 17.4338 15.7264 15.9753 17.0389 15.3191L18.5252 14.5759C18.5384 14.5693 18.545 14.566 18.5511 14.5629C19.8951 13.8852 20.7448 12.5103 20.75 11.0051C20.75 10.9982 20.75 10.9909 20.75 10.9761C20.75 10.9705 20.75 10.9678 20.75 10.9668C20.7486 10.748 20.5274 10.6055 20.3276 10.6948C20.3268 10.6952 20.3235 10.6967 20.3168 10.6997C19.964 10.8599 19.5741 11.0281 19.1535 11.1964C17.2378 11.9627 14.6361 12.75 12 12.75C9.3639 12.75 6.7622 11.9627 4.84646 11.1964C4.42592 11.0281 4.03597 10.8599 3.68316 10.6997Z"
              fill="currentColor"
            />
          </svg>
          <Subtitle subtitle="Thoughtful design"></Subtitle>
          <article>
            <p>
              Unlike traditional clunky logging/notification software, Operational has been built with the highest
              consideration of user interface.
            </p>
            <p>Every aspect of Ops is built to evoke joy - from the API design to the webapp interface.</p>
          </article>
        </div>
      </div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";

export default {
  components: {
    Constrain,
    Subtitle
  },

  props: {
    subtitle: {
      default: "Landing page"
    },
    heading: {
      type: String,
      default: "h2"
    },
    size: {
      type: String,
      default: ""
    }
  },

  computed: {}
};
</script>

<style lang="scss">
.c-page-cards {
  padding: 4rem 0;

  h2 {
    text-align: center;
    margin-bottom: 3rem;
  }

  &__inner {
    display: grid;

    grid-template-columns: repeat(2, 1fr);
    //grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
  }

  .c-subtitle {
    color: var(--color-primary-light);
    font-weight: 600;
  }

  &__card {
    position: relative;
    isolation: isolate;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(35, 35, 38, 0.6) 0.01%, rgba(46, 46, 52, 0.5) 100%),
      linear-gradient(0deg, rgba(35, 35, 38, 0.2) 0.01%, rgba(46, 46, 52, 0.2) 100%);
    border-radius: var(--border-radius-xl);
    padding: var(--spacer);
    overflow: hidden;

    svg {
      margin-bottom: 1rem;
      width: 32px;
      height: 32px;
    }

    article {
    }
  }

  @media screen and (max-width: 576px) {
    &__inner {
      grid-template-columns: repeat(1, 1fr);
    }

    &__card {
      padding: var(--spacer-sm);
    }
  }
}
</style>
