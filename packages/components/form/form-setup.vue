<template>
  <div class="f-setup">
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
      initialValues: {
        email: "",
        password: ""
      },
      schema: {
        firstName: {
          label: "First name",
          type: "InputText",
          placeholder: "",
          validations: {
            required: {
              params: null,
              message: "First name is required"
            }
          }
        },
        // lastName: {
        //   label: "Last name",
        //   type: "InputText",
        //   placeholder: "",
        //   validations: {
        //     required: {
        //       params: null,
        //       message: "Last name is required"
        //     }
        //   }
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
              message: "Email is required"
            }
          }
        },
        password: {
          label: "Password",
          type: "InputPassword",
          placeholder: "********",
          validations: {
            required: {
              params: null,
              message: "Password is required"
            },
            minLength: {
              params: 8,
              message: "Password should be more than 8 characters"
            },
            maxLength: {
              params: 50,
              message: "Password cannot be more than 50 characters"
            }
          }
        },
        projectName: {
          label: "Project name",
          type: "InputText",
          placeholder: "Acme inc",
          validations: {
            required: {
              params: null,
              message: "Project name is required"
            },
            minLength: {
              params: 4,
              message: "Project name must be at least 4 characters"
            }
          }
        }
      }
    };
  },

  computed: {
    button: function () {
      return {
        text: "Create account"
      };
    }
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.user.setup(e);
        console.log(res);
      } catch (err) {
        throw err;
      }
    }
  }
};
</script>

<style lang="scss"></style>
