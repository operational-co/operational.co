<template>
  <div class="f-login">
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
      initialValues: {
        email: "",
        password: "",
      },
      schema: {
        email: {
          label: "Email",
          type: "InputEmail",
          placeholder: "name@domain.com",
          validations: {
            required: {
              params: null,
              message: "Email is required",
            },
          },
        },
        password: {
          label: "Password",
          type: "InputPassword",
          placeholder: "********",
          validations: {
            required: {
              params: null,
              message: "Password is required",
            },
            minLength : {
              params : 8,
              message : 'Password should be more than 8 characters'
            }
          },
        },
      },
    };
  },

  computed: {
    button: function () {
      return {
        text: "Login",
      };
    },
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.user.login(e);
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style lang="scss"></style>
