<template>
  <div class="f-reset-password-request">
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
      schema: {
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
        }
      }
    };
  },

  computed: {
    button: function () {
      return {
        text: "Reset password"
      };
    }
  },

  methods: {
    async submissionFx(e) {
      console.log(e);

      let res = null;
      try {
        res = await this.$store.user.resetPasswordRequest(e);
        console.log(res);
      } catch (err) {
        throw err;
      }

      this.$emit("onSubmit", res);
    }
  }
};
</script>

<style lang="scss"></style>
