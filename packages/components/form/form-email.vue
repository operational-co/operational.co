<template>
  <div class="f-email">
    <h3>Update your email</h3>
    <p>
      <small>Your current email is {{ user.email }}</small>
    </p>
    <Form :initialValues="initialValues" :submissionFx="submissionFx" :schema="schema" :button="button"></Form>
  </div>
</template>

<script>
import Form from "./index.vue";

export default {
  components: {
    Form
  },

  data: function () {
    return {
      initialValues: {},
      schema: {
        email: {
          label: "Enter your new email",
          type: "InputEmail",
          placeholder: "me@acme.com",
          validations: {
            email: {
              params: null,
              message: "You need a valid email address"
            }
          },
          description:
            "You will be sent an email confirmation link in your inbox. Click the link to confirm your email change. This link will automatically expire after 24 hours."
        }
      }
    };
  },

  computed: {
    button: function () {
      return {
        text: "Update email"
      };
    },
    user: function () {
      return this.$store.user.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.user.updateEmail(e);
      } catch (err) {
        throw err;
      }
    }
  }
};
</script>

<style lang="scss">
.f-email {
}
</style>
