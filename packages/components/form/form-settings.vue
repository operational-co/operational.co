<template>
  <div class="f-user">
    <h3>Settings</h3>
    <Form v-if="initialValues" :initialValues="initialValues" :schema="schema" :submissionFx="submissionFx"></Form>
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
      initialValues: null,

      schema: {
        // notify: {
        //   label: "Notifications",
        //   type: "InputText",
        //   placeholder: "",
        //   validations: {
        //     required: {
        //       params: null,
        //       message: "First name is required",
        //     },
        //   },
        // },
        timezone: {
          label: "Timezone",
          type: "InputTimezone",
          placeholder: "",
          validations: {
            required: {
              params: null,
              message: "Last name is required"
            }
          }
        }
        // military_time: {
        //   label: "Show time in military format?",
        //   type: "InputSwitch",
        // },
      }
    };
  },

  computed: {
    user: function () {
      return this.$store.user.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.user.update(e);
      } catch (err) {
        throw err;
      }
    }
  },

  mounted: function () {
    this.initialValues = {
      firstName: this.user.firstName,
      lastName: this.user.lastName
    };
  }
};
</script>

<style lang="scss"></style>
