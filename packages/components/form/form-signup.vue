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
        firstName: {
          label: "Name",
          type: "InputText",
          placeholder: "",
          validations: {
            required: {
              params: null,
              message: "First name is required",
            },
          },
        },
        // lastName: {
        //   label: "Last name",
        //   type: "InputText",
        //   placeholder: "",
        //   validations: {
        //     required: {
        //       params: null,
        //       message: "Last name is required",
        //     },
        //   },
        // },
        // companyUrl: {
        //   label: "Company url",
        //   type: "InputText",
        //   placeholder: "acme.com",
        //   validations: {
        //     required: {
        //       params: null,
        //       message: "Company url is required",
        //     },
        //   },
        // },
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
        text: "Signup",
      };
    },
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.user.signup(e);
        console.log(res);
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style lang="scss"></style>
