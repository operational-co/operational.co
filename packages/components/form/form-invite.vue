<template>
  <div class="f-invite">
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
        firstName: {
          type: "InputText",
          placeholder: "First name",
          validations: {
            required: {
              params: null,
              message: "You need to provide a name"
            }
          }
        },
        email: {
          type: "InputEmail",
          placeholder: "Email",
          validations: {
            required: {
              params: null,
              message: "You need to provide a email"
            }
          }
        }
      }
    };
  },

  computed: {
    button: function () {
      return {
        text: "Invite user"
      };
    },
    user: function () {
      return this.$store.user.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      const form = {
        name: e.firstName,
        email: e.email
      };
      try {
        const res = await this.$store.workspace.inviteUser(form);
        this.$emit("onSubmit", res);
      } catch (err) {
        throw err;
      }
    }
  }
};
</script>

<style lang="scss">
.f-projectname {
}
</style>
