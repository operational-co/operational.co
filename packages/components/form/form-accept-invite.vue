<template>
  <div class="f-accept-invite">
    <p>👋 Welcome {{ inviteData.user.firstName }} to {{ inviteData.workspace.name }}'s project.</p>
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
          placeholder: "",
          label: "Last name",
          validations: {
            required: {
              params: null,
              message: "You need to provide a name"
            }
          }
        },
        lastName: {
          type: "InputText",
          label: "Last name"
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
        }
      }
    };
  },

  props: {
    inviteData: {},
    inviteCode: {}
  },

  computed: {
    button: function () {
      return {
        text: "Accept invite"
      };
    },
    user: function () {
      return this.$store.user.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      const form = {
        firstName: e.firstName,
        lastName: e.lastName,
        inviteCode: this.inviteCode,
        password: e.password
      };
      try {
        const res = await this.$store.workspace.acceptInvite(form);
        if (res) {
          this.$emit("onSubmit", res);

          await this.$store.user.signup(null, res);
        }
      } catch (err) {
        throw err;
      }
    }
  },

  mounted: function () {
    this.initialValues = {
      firstName: this.inviteData.user.firstName
    };
  }
};
</script>

<style lang="scss">
.f-accept-invite {
  > p {
    text-align: center;
  }
}
</style>
