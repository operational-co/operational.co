<template>
  <div class="f-password">
    <h3>Update your password</h3>
    <Form :initialValues="initialValues" :submissionFx="submissionFx" :schema="schema" :button="button"></Form>
  </div>
</template>

<script>
import Form from "./index.vue";

export default {
  components: {
    Form,
  },

  data: function () {
    return {
      initialValues: {},
      schema: {
        currentPassword: {
          label: "Current password",
          type: "InputPassword",
          placeholder: "********",
          validations: {
            required: {
              params: null,
              message: "You need to enter your current password",
            },
          },
        },
        password1: {
          label: "New password",
          type: "InputPassword",
          placeholder: "********",
          validations: {
            required: {
              params: null,
              message: "Password is required",
            },
          },
        },
        password2: {
          label: "Confirm password",
          type: "InputPassword",
          placeholder: "********",
          validations: {
            required: {
              params: null,
              message: "Password is required",
            },
          },
        },
      },
    };
  },

  computed: {
    button: function () {
      return {
        text: "Updated Password",
      };
    },
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.user.updatePassword(e);
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style lang="scss">
.f-password {
}
</style>
