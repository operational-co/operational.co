<template>
  <div class="f-contact-edit">
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
        firstName: {
          label: "First Name",
          type: "InputText",
        },
        lastName: {
          label: "Last Name",
          type: "InputText",
        },
        utcOffset: {
          label: "UTC Offset",
          type: "InputText",
        },
        country: {
          label: "Country",
          type: "InputText",
        },
      },
    };
  },

  props: {
    initialValues: {
      default: function () {
        return {};
      },
    },
  },

  computed: {
    button: function () {
      return {
        text: "Update",
      };
    },
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.user.login(e);
        console.log(res);
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style lang="scss"></style>
