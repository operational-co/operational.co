<template>
  <div class="c-footer">
    <div class="c-footer__inner">
      <div class="c-footer__left">
        <a class="logo" href="/">
          <h1>Operational</h1>
        </a>

        <a data-astro-prefetch class="muted" href="/privacy">Privacy</a>
        <a data-astro-prefetch class="muted" href="/terms">Terms</a>
        <div class="c-footer__socials">
          <svg
            @click="navTo('https://discord.gg/BdTbsQhRzc')"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.6361 5.0228C18.1907 4.35756 16.6648 3.88561 15.0973 3.61902C14.8828 4.00447 14.6888 4.40105 14.5159 4.8071C12.8463 4.55418 11.1484 4.55418 9.47881 4.8071C9.30587 4.4011 9.1118 4.00452 8.8974 3.61902C7.32897 3.88786 5.80205 4.36093 4.35518 5.02628C1.48276 9.29851 0.70409 13.4646 1.09342 17.5716C2.77558 18.821 4.6584 19.7712 6.66003 20.3809C7.11074 19.7715 7.50956 19.1251 7.85226 18.4483C7.20135 18.2039 6.57311 17.9024 5.9748 17.5473C6.13227 17.4325 6.28627 17.3142 6.43508 17.1994C8.17601 18.0224 10.0761 18.4491 12 18.4491C13.9238 18.4491 15.8239 18.0224 17.5648 17.1994C17.7154 17.3229 17.8694 17.4412 18.0251 17.5473C17.4257 17.903 16.7963 18.2051 16.1442 18.4501C16.4865 19.1265 16.8853 19.7724 17.3364 20.3809C19.3398 19.7737 21.224 18.8239 22.9065 17.5734C23.3633 12.8106 22.1261 8.68273 19.6361 5.0228ZM8.34541 15.0459C7.26047 15.0459 6.36414 14.0561 6.36414 12.8384C6.36414 11.6208 7.22932 10.6223 8.34195 10.6223C9.45458 10.6223 10.344 11.6208 10.325 12.8384C10.3059 14.0561 9.45112 15.0459 8.34541 15.0459ZM15.6545 15.0459C14.5678 15.0459 13.675 14.0561 13.675 12.8384C13.675 11.6208 14.5401 10.6223 15.6545 10.6223C16.7689 10.6223 17.6514 11.6208 17.6323 12.8384C17.6133 14.0561 16.7602 15.0459 15.6545 15.0459Z"
              fill="currentColor"
            />
          </svg>
          <svg
            @click="navTo('https://x.com/shash122tfu')"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.4033 3.5H20.2852L13.989 10.701L21.396 20.5H15.5964L11.054 14.557L5.85637 20.5H2.97269L9.70709 12.7977L2.60156 3.5H8.54839L12.6544 8.93215L17.4033 3.5ZM16.3918 18.7738H17.9887L7.68067 5.13549H5.96702L16.3918 18.7738Z"
              fill="currentColor"
            />
          </svg>
          <svg
            @click="navTo('https://www.linkedin.com/in/shash7/')"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.65 3H4.35C3.99196 3 3.64858 3.14223 3.39541 3.39541C3.14223 3.64858 3 3.99196 3 4.35V19.65C3 20.008 3.14223 20.3514 3.39541 20.6046C3.64858 20.8578 3.99196 21 4.35 21H19.65C20.008 21 20.3514 20.8578 20.6046 20.6046C20.8578 20.3514 21 20.008 21 19.65V4.35C21 3.99196 20.8578 3.64858 20.6046 3.39541C20.3514 3.14223 20.008 3 19.65 3ZM8.4 18.3H5.7V10.2H8.4V18.3ZM7.05 8.625C6.74056 8.61616 6.4406 8.51632 6.18758 8.33797C5.93456 8.15962 5.7397 7.91066 5.62737 7.6222C5.51503 7.33374 5.49019 7.01857 5.55595 6.71607C5.6217 6.41358 5.77515 6.13716 5.9971 5.92138C6.21906 5.70559 6.49968 5.55999 6.80391 5.50278C7.10814 5.44556 7.42248 5.47927 7.70766 5.59969C7.99284 5.7201 8.23622 5.92189 8.40737 6.17983C8.57853 6.43778 8.66987 6.74044 8.67 7.05C8.66289 7.47331 8.4885 7.8766 8.18495 8.17173C7.88139 8.46685 7.47335 8.62982 7.05 8.625ZM18.3 18.3H15.6V14.034C15.6 12.756 15.06 12.297 14.358 12.297C14.1522 12.3107 13.9511 12.3649 13.7663 12.4566C13.5815 12.5482 13.4166 12.6755 13.2811 12.831C13.1457 12.9866 13.0422 13.1674 12.9768 13.363C12.9114 13.5586 12.8853 13.7652 12.9 13.971C12.8955 14.0129 12.8955 14.0551 12.9 14.097V18.3H10.2V10.2H12.81V11.37C13.0733 10.9695 13.435 10.6433 13.8605 10.4227C14.286 10.2021 14.761 10.0944 15.24 10.11C16.635 10.11 18.264 10.884 18.264 13.404L18.3 18.3Z"
              fill="currentColor"
            />
          </svg>
          <svg
            @click="navTo('https://github.com/operational-co/operational.co')"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1.95068C17.525 1.95068 22 6.42568 22 11.9507C21.9995 14.0459 21.3419 16.0883 20.1198 17.7902C18.8977 19.4922 17.1727 20.768 15.1875 21.4382C14.6875 21.5382 14.5 21.2257 14.5 20.9632C14.5 20.6257 14.5125 19.5507 14.5125 18.2132C14.5125 17.2757 14.2 16.6757 13.8375 16.3632C16.0625 16.1132 18.4 15.2632 18.4 11.4257C18.4 10.3257 18.0125 9.43818 17.375 8.73818C17.475 8.48818 17.825 7.46318 17.275 6.08818C17.275 6.08818 16.4375 5.81318 14.525 7.11318C13.725 6.88818 12.875 6.77568 12.025 6.77568C11.175 6.77568 10.325 6.88818 9.525 7.11318C7.6125 5.82568 6.775 6.08818 6.775 6.08818C6.225 7.46318 6.575 8.48818 6.675 8.73818C6.0375 9.43818 5.65 10.3382 5.65 11.4257C5.65 15.2507 7.975 16.1132 10.2 16.3632C9.9125 16.6132 9.65 17.0507 9.5625 17.7007C8.9875 17.9632 7.55 18.3882 6.65 16.8757C6.4625 16.5757 5.9 15.8382 5.1125 15.8507C4.275 15.8632 4.775 16.3257 5.125 16.5132C5.55 16.7507 6.0375 17.6382 6.15 17.9257C6.35 18.4882 7 19.5632 9.5125 19.1007C9.5125 19.9382 9.525 20.7257 9.525 20.9632C9.525 21.2257 9.3375 21.5257 8.8375 21.4382C6.8458 20.7752 5.11342 19.502 3.88611 17.799C2.65881 16.096 1.9989 14.0498 2 11.9507C2 6.42568 6.475 1.95068 12 1.95068Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <div class="c-footer__mid">
        <section>
          <strong> About the product </strong>
          <ul>
            <li v-for="(link, i) in productLinks" :key="i">
              <a :href="`${link.slug}`">
                {{ link.title }}
              </a>
            </li>
          </ul>
        </section>
      </div>
      <div class="c-footer__right">
        <section>
          <strong> Related to the product </strong>
          <ul>
            <li v-for="(link, i) in relatedLinks" :key="i">
              <a :href="`${link.slug}`">
                {{ link.title }}
              </a>
            </li>
          </ul>
        </section>
        <section>
          <strong> Useful articles for your SaaS </strong>
          <ul>
            <li v-for="post in computedPosts" :key="post.id">
              <a data-astro-prefetch :href="`/articles/${post.slug}`">
                {{ post.title }}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      productLinks: [
        // {
        //   slug: "/pricing",
        //   title: "Pricing"
        // },
        {
          slug: "/usecases",
          title: "Use cases",
        },
        {
          slug: "/playground",
          title: "Playground",
        },
        {
          slug: "/api",
          title: "API",
        },
        {
          slug: "/pitch",
          title: "Pitch",
        },
        {
          slug: "/wordpress",
          title: "Wordpress plugin",
        },
        {
          slug: "/bubble",
          title: "Bubble plugin",
        },
      ],
      relatedLinks: [
        {
          slug: "/vs-logsnag",
          title: "VS Logsnag",
        },
        {
          slug: "/open-source",
          title: "Open Source",
        },
        {
          slug: "/articles",
          title: "Articles",
        },
      ],
    };
  },

  props: {
    posts: {},
  },

  computed: {
    computedPosts: function () {
      if (!this.posts) {
        return [];
      }

      let newPosts = JSON.parse(JSON.stringify(this.posts));

      return newPosts.slice(0, 4);
    },
  },

  methods: {
    navTo: function (link) {
      window.open(link, "_blank");
    },
  },
};
</script>

<style lang="scss">
.c-footer {
  padding: 4rem 0;
  border-top: var(--color-bg-4) solid 1px;

  &__inner {
    max-width: 740px;
    margin: 0 auto;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: var(--margin-lg);
    padding: 0 var(--margin-lg);
  }

  &__left {
    p {
      margin-bottom: 0.5rem;
    }
  }

  &__mid {
  }

  &__right {
    section {
      margin-bottom: 1rem;
    }

    a {
      display: block;
    }

    strong {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      color: var(--color-font-heading);
    }
  }

  &__socials {
    margin-top: 1rem;
    display: flex;

    svg {
      margin-right: 0.5rem;
      cursor: pointer;
    }
  }

  .muted {
    display: inline-block;
    margin-right: var(--margin);
    font-size: var(--font-size-sm);
    color: var(--color-font);
    opacity: 0.8;

    &:hover,
    &:active {
      opacity: 1;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: block;
      margin-left: -2rem;

      & + li {
        margin-top: 0.25rem;
      }

      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
    }

    a {
      display: inline-block;
      color: var(--color-font);
      opacity: 0.8;

      &:hover,
      &:active {
        opacity: 1;
      }
    }
  }

  .logo {
    position: relative;
    margin-right: auto;

    display: flex;
    align-items: center;

    margin-bottom: 1rem;

    h1 {
      display: inline-block;
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
      padding: var(--margin);
      margin-left: var(--margin);
      font-size: var(--font-size-sm);
      font-weight: 500;
      font-family: var(--font-family-monospace);
      line-height: 1;
      color: var(--color-font-light);
      background-color: var(--color-bg-2);
      border-radius: var(--border-radius);
    }

    &:after {
      content: "Beta";
      display: inline-block;
      line-height: 1;
      margin-left: var(--margin);
      font-family: var(--font-family-monospace);
      font-size: var(--font-size-sm);
      font-weight: 500;
      background-color: var(--color-bg-3);
      padding: var(--margin-sm) var(--margin);
      border-radius: var(--border-radius-sm);
      color: var(--color-font);
    }
  }

  @media screen and (max-width: 576px) {
    background-color: var(--color-bg-2);
    padding: 3rem 0;

    .logo {
      margin-bottom: 0.5rem;
    }

    &__inner {
      display: block;
    }

    &__left {
      margin-bottom: 1rem;

      p {
        display: none;
      }
    }

    &__right {
      text-align: left;
    }

    ul {
      li {
        margin-left: 0;
        margin-right: var(--margin);
      }

      a {
        padding: var(--margin-sm) 0;
      }
    }
  }
}
</style>
