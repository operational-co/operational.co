<template>
  <div class="c-settings">
    <Constrain>
      <header>
        <router-link v-if="$route.path !== '/settings'" to="/settings">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9998 20L7.70696 12.7071C7.31643 12.3166 7.31643 11.6834 7.70695 11.2929L14.9998 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <h3>Settings /</h3>
        </router-link>
        <h3>{{ currentPageName }}</h3>
      </header>

      <template v-if="$route.path === '/settings'">
        <ProfileCard></ProfileCard>

        <!--
        <ul>
          <li>
            <router-link to="/settings/project">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19H14M4 19V4H14V8M4 19H2M20 19H14M20 19V8H14M20 19H22M14 19V8M10 9H8M8 13H10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span> Project </span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings/project-users">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.001 3C16.934 3 18.501 4.567 18.501 6.5C18.501 8.433 16.934 10 15.001 10M20.501 20H22.001C22.5533 20 23.0094 19.5492 22.9207 19.0041C22.5135 16.5029 20.5954 14.4277 18.001 13.5088M9.00104 10C7.06805 10 5.50104 8.433 5.50104 6.5C5.50104 4.567 7.06805 3 9.00104 3C10.934 3 12.501 4.567 12.501 6.5C12.501 8.433 10.934 10 9.00104 10ZM1.08141 19.004C1.63399 15.6098 4.96921 13 9.00104 13C13.0329 13 16.3681 15.6098 16.9207 19.004C17.0094 19.5491 16.5533 20 16.001 20H2.00104C1.44876 20 0.992665 19.5491 1.08141 19.004Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>Project Users</span>
            </router-link>
          </li>
        </ul>
        -->

        <ul>
          <!-- <li>
            <router-link to="/settings/token">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.75 12C1.75 14.8995 4.10051 17.25 7 17.25C8.69095 17.25 10.1952 16.4506 11.1554 15.2091C11.3677 14.9345 11.6844 14.75 12.0315 14.75H13.7132C13.9006 14.75 14.0843 14.6973 14.2432 14.598L15.47 13.8312C15.7943 13.6286 16.2057 13.6286 16.53 13.8312L17.7568 14.598C17.9157 14.6973 18.0994 14.75 18.2868 14.75H20.0261C20.3261 14.75 20.6101 14.6154 20.8001 14.3832L22.2319 12.6332C22.5333 12.2649 22.5333 11.7351 22.2319 11.3668L20.8001 9.61676C20.6101 9.38463 20.3261 9.25 20.0261 9.25H12.0315C11.6844 9.25 11.3677 9.06549 11.1554 8.79095C10.1952 7.54942 8.69095 6.75 7 6.75C4.10051 6.75 1.75 9.10051 1.75 12Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.75 12C7.75 12.4142 7.41421 12.75 7 12.75C6.58579 12.75 6.25 12.4142 6.25 12C6.25 11.5858 6.58579 11.25 7 11.25C7.41421 11.25 7.75 11.5858 7.75 12Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>

              <span> API tokens </span>
            </router-link>
          </li> -->
          <li>
            <router-link to="/settings/notifications">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 18C15.3267 19.7659 13.7891 21 12 21C10.2109 21 8.67326 19.7659 7.99999 18M6.28436 18H17.7156C18.9252 18 19.8579 16.9346 19.6981 15.7357L18.793 8.94737C18.339 5.54271 15.4348 3 12 3C8.5652 3 5.66097 5.5427 5.20701 8.94736L4.3019 15.7357C4.14204 16.9346 5.07478 18 6.28436 18Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>

              <span> Push Notifications </span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings/profile">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.11594 18.8103C7.44562 17.0943 9.50054 16 12 16C14.4995 16 16.5544 17.0943 17.8841 18.8103M6.11594 18.8103C7.69368 20.1747 9.75046 21 12 21C14.2495 21 16.3063 20.1747 17.8841 18.8103M6.11594 18.8103C4.20753 17.16 3 14.721 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 14.721 19.7925 17.16 17.8841 18.8103M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>

              <span> Profile </span>
            </router-link>
          </li>
          <li class="link-project">
            <router-link to="/settings/project">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19H14M4 19V4H14V8M4 19H2M20 19H14M20 19V8H14M20 19H22M14 19V8M10 9H8M8 13H10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span> Project </span>
              <div class="avatar-container">
                <Avatar v-for="user in users" :key="user.id" :user="user"></Avatar>
              </div>
            </router-link>
          </li>
          <li v-if="!isSelfHosted">
            <router-link to="/settings/billing">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 10V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V10M3 10V6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44649 21 5.99878V10M3 10H21M7 14H10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span> Billing </span>
            </router-link>
          </li>
          <li v-if="!isSelfHosted">
            <router-link to="/settings/invoices">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.75 7.75H15.25M8.75 11.75H11.25M19.25 21.25V3.75C19.25 3.19772 18.8023 2.75 18.25 2.75H5.75C5.19772 2.75 4.75 3.19772 4.75 3.75V21.25L7.33333 19L9.66667 21.25L12 19L14.3333 21.25L16.6667 19L19.25 21.25Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span> Invoices </span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings/usage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.0465 20.9986C13.3592 20.9791 13.6269 20.7674 13.7178 20.4675L18.1871 5.71894L20.5861 10.2862C20.7787 10.653 21.2321 10.7941 21.5988 10.6015C21.9655 10.4089 22.1066 9.95544 21.914 9.58873L18.664 3.40124C18.5225 3.13177 18.2321 2.97457 17.9291 3.00335C17.6261 3.03214 17.3705 3.24119 17.2823 3.53249L12.8668 18.1035L8.68541 8.69539C8.57175 8.43966 8.32517 8.26848 8.04584 8.25139C7.76652 8.2343 7.50091 8.37415 7.35693 8.61412L4.93389 12.6525L3.35227 10.5217C3.1054 10.1891 2.63563 10.1196 2.30303 10.3665C1.97043 10.6134 1.90094 11.0832 2.14782 11.4158L4.39782 14.447C4.54705 14.648 4.78675 14.7614 5.03683 14.7491C5.2869 14.7368 5.51435 14.6006 5.64317 14.3859L7.90075 10.6232L12.3147 20.5546C12.4419 20.8409 12.7338 21.018 13.0465 20.9986Z"
                  fill="currentColor"
                />
              </svg>

              <span>Usage </span>
            </router-link>
          </li>
          <li v-if="isSelfHosted">
            <router-link to="/settings/server">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V12M21 12H3M21 12V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V12"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="square"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.5 9.375C6.98325 9.375 7.375 8.98325 7.375 8.5C7.375 8.01675 6.98325 7.625 6.5 7.625C6.01675 7.625 5.625 8.01675 5.625 8.5C5.625 8.98325 6.01675 9.375 6.5 9.375ZM6.5 16.375C6.98325 16.375 7.375 15.9832 7.375 15.5C7.375 15.0168 6.98325 14.625 6.5 14.625C6.01675 14.625 5.625 15.0168 5.625 15.5C5.625 15.9832 6.01675 16.375 6.5 16.375Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.5"
                />
              </svg>
              <span>Server</span>
            </router-link>
          </li>
        </ul>
      </template>
      <template v-else>
        <router-view v-slot="{ Component }">
          <transition name="fade-slide">
            <component :is="Component" />
          </transition>
        </router-view>
      </template>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import ProfileCard from "./profile-card.vue";

import Avatar from "@operational.co/components/ui/avatar.vue";

export default {
  components: {
    Constrain,
    ProfileCard,
    Avatar,
  },

  data: function () {
    return {};
  },

  computed: {
    isSelfHosted: function () {
      const condition = this.$store.app.isSelfHosted;
      return condition;
    },
    currentPageName: function () {
      return this.$route.name;
    },
    user: function () {
      return this.$store.user.resource;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    users: function () {
      if (!this.workspace) {
        return [];
      }

      let users = this.workspace.users || [];

      users = users.slice().reverse();

      return users.slice(0, 5);
    },
    assetPath: function () {
      let baseUrl = this.baseApiUrl;
      return `${baseUrl}/uploads`;
    },
  },

  methods: {},

  mounted: function () {},
};
``;
</script>

<style lang="scss">
.c-settings {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .fade-slide-enter,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
  .fade-slide-enter-to,
  .fade-slide-leave {
    opacity: 1;
    transform: translateX(0);
  }

  &-section {
    background-color: var(--color-bg-2);
    padding: var(--margin-lg);
    border-radius: var(--margin-lg);

    .form-control {
      background-color: var(--color-bg-1);
    }
  }

  .c-constrain__inner > header {
    display: flex;

    a {
      display: inline-flex;
      align-items: center;
      margin-right: var(--margin);
      color: var(--color-font);
      flex-wrap: nowrap;
      transition: all var(--transition-time) ease;

      svg {
        display: inline-block;
        margin-bottom: 1rem;
        margin-right: 0.25rem;
      }

      h3 {
        display: inline-block;
        font-weight: 500;
      }

      &:hover,
      &:active {
        color: var(--color-link);

        h3 {
          color: var(--color-link);
        }
      }
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-bottom: 1rem;

    li {
      margin: 0;
      padding-left: 0;

      &:before {
        display: none;
      }

      a {
        display: grid;
        grid-template-columns: 24px 1fr;
        grid-column-gap: var(--margin-lg);
        background-color: var(--color-bg-2);
        border-bottom: var(--color-bg-3) solid 1px;
        padding: var(--margin-lg);
        color: var(--color-font);
        transition: all var(--transition-time-sm) linear;

        span {
        }

        &:hover,
        &:active {
          background-color: var(--color-bg-3);
        }
      }

      &:first-child {
        a {
          border-top-left-radius: var(--margin-lg);
          border-top-right-radius: var(--margin-lg);
        }
      }

      &:last-child {
        a {
          border-bottom-left-radius: var(--margin-lg);
          border-bottom-right-radius: var(--margin-lg);

          border-bottom: none;
        }
      }

      &.link-project {
        a {
          grid-template-columns: 24px 1fr 1fr;
          div {
            margin-left: auto;

            .c-avatar {
              width: 24px;
              height: 24px;
              min-width: 24px;
            }
          }
        }
      }
    }
  }

  > section,
  .c-constrain__inner > section {
    background-color: var(--color-bg-2);
    padding: var(--margin-lg);
    border-radius: var(--margin-lg);

    .form-control {
      background-color: var(--color-bg-1);
    }
  }

  .avatar-container {
    display: flex;

    .c-avatar {
      margin-right: -0.5rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  @media screen and (max-width: 940px) {
    //padding-top: var(--margin-lg);
  }
}
</style>
