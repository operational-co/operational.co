<template>
  <main class="p-oauth-consent">
    <section class="p-oauth-consent__card">
      <header class="p-oauth-consent__header">
        <div class="p-oauth-consent__logo">O</div>
        <p class="p-oauth-consent__eyebrow">Connect to Operational</p>
        <h1>{{ title }}</h1>
        <p v-if="details" class="p-oauth-consent__intro">
          <strong>{{ details.clientName }}</strong> wants to access your Operational workspace.
        </p>
      </header>

      <div v-if="!isAuth" class="p-oauth-consent__status">
        Sign in to review this connection request.
      </div>

      <div v-else-if="loading" class="p-oauth-consent__status">Loading connection details…</div>

      <div v-else-if="error" class="p-oauth-consent__status p-oauth-consent__status--error">
        <p>{{ error }}</p>
        <p>Return to the app you started from and try connecting again.</p>
      </div>

      <div v-else-if="details" class="p-oauth-consent__body">
        <dl class="p-oauth-consent__account">
          <div>
            <dt>Signed in as</dt>
            <dd>{{ details.user.email }}</dd>
          </div>
          <div>
            <dt>Workspace</dt>
            <dd>{{ details.workspace.name }}</dd>
          </div>
          <div>
            <dt>Client</dt>
            <dd>{{ details.clientHost }}</dd>
          </div>
          <div>
            <dt>Returns to</dt>
            <dd>{{ details.redirectHost }}</dd>
          </div>
        </dl>

        <div v-if="details.loopbackRedirect" class="p-oauth-consent__warning" role="alert">
          This connection returns to an app running on your device. Continue only if you started
          this connection.
        </div>

        <div class="p-oauth-consent__permissions">
          <h2>This app will be able to</h2>
          <ul>
            <li v-for="permission in details.permissions" :key="permission">
              {{ permission }}
            </li>
          </ul>
        </div>

        <div class="p-oauth-consent__actions">
          <button
            class="btn btn-primary"
            type="button"
            :disabled="submitting"
            @click="decide('allow')"
          >
            {{ submitting ? "Connecting…" : "Allow access" }}
          </button>
          <button class="btn" type="button" :disabled="submitting" @click="decide('deny')">
            Cancel
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import http from "@/lib/http.js";

export default {
  data: function () {
    return {
      loading: true,
      submitting: false,
      details: null,
      error: "",
    };
  },

  computed: {
    isAuth: function () {
      return this.$store.user.isAuth;
    },
    title: function () {
      return this.error ? "Connection could not continue" : "Allow event access?";
    },
    oauthRequest: function () {
      return {
        response_type: this.$route.query.response_type,
        client_id: this.$route.query.client_id,
        redirect_uri: this.$route.query.redirect_uri,
        state: this.$route.query.state,
        code_challenge: this.$route.query.code_challenge,
        code_challenge_method: this.$route.query.code_challenge_method,
        scope: this.$route.query.scope,
        response_mode: this.$route.query.response_mode,
        resource: this.$route.query.resource,
      };
    },
  },

  watch: {
    isAuth: function (isAuth) {
      if (isAuth && !this.details && !this.error) {
        this.loadDetails();
      }
    },
  },

  mounted: function () {
    if (this.isAuth) {
      this.loadDetails();
    }
  },

  methods: {
    loadDetails: async function () {
      this.loading = true;
      this.error = "";

      try {
        const response = await http.post("/authorize/details", this.oauthRequest);
        this.details = response.data;
      } catch (err) {
        this.error = this.getOauthErrorMessage(err, "We could not load this connection request.");
      } finally {
        this.loading = false;
      }
    },
    decide: async function (decision) {
      this.submitting = true;
      this.error = "";

      try {
        const response = await http.post("/authorize/decision", {
          ...this.oauthRequest,
          decision,
        });
        window.location.assign(response.data.completionUrl);
      } catch (err) {
        this.error = this.getOauthErrorMessage(err, "We could not finish this connection.");
        this.submitting = false;
      }
    },
    getOauthErrorMessage: function (err, fallback) {
      if (err && typeof err.error_description === "string") {
        return err.error_description;
      }

      return (err && err.message) || fallback;
    },
  },
};
</script>

<style lang="scss">
.p-oauth-consent {
  min-height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: var(--color-bg-1);

  &__card {
    width: 100%;
    max-width: 32rem;
    padding: 2rem;
    border: 1px solid var(--color-bg-4);
    border-radius: var(--border-radius);
    background-color: var(--color-bg-0);
    box-shadow: var(--box-shadow-low);
  }

  &__header {
    text-align: center;

    h1 {
      margin: 0.5rem 0;
    }
  }

  &__logo {
    width: 3rem;
    height: 3rem;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: var(--color-primary);
    color: var(--color-bg-0);
    font-weight: 700;
  }

  &__eyebrow,
  &__intro,
  &__status {
    margin: 0;
  }

  &__eyebrow {
    color: var(--color-font-light);
  }

  &__intro,
  &__status {
    margin-top: 0.5rem;
  }

  &__body {
    margin-top: 2rem;
  }

  &__account {
    margin: 0;

    div {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--color-bg-3);
    }

    dt {
      color: var(--color-font-light);
    }

    dd {
      margin: 0;
      text-align: right;
      overflow-wrap: anywhere;
    }
  }

  &__warning,
  &__status--error {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: var(--border-radius);
    background-color: var(--color-bg-2);
  }

  &__permissions {
    margin-top: 2rem;

    ul {
      padding-left: 1.25rem;
    }
  }

  &__actions {
    margin-top: 2rem;
    display: flex;
    gap: 0.75rem;

    .btn {
      flex: 1;
    }
  }

  @media screen and (max-width: 576px) {
    align-items: flex-start;

    &__card {
      padding: 1rem;
    }

    &__actions {
      flex-direction: column;
    }
  }
}
</style>
