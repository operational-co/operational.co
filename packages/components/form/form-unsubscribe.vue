<template>
  <div class="f-unsubscribe">
    <Form :button="button" :initialValues="initialValues" :schema="schema" :submissionFx="submissionFx"></Form>
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

      button: {
        text: "Cancel subscription"
      },

      schema: {
        reason: {
          label: "Unsubscribe reason",
          type: "InputRadio",
          placeholder: "",
          options: [
            {
              key: "I no longer need to track events"
            },
            {
              key: `Technical issue - can't track events or other issues`
            },
            {
              key: `I'm moving jobs or no longer in this industry`
            },
            {
              key: `I'm switching to another tool`
            },
            {
              key: `I can no longer afford this`
            },
            {
              key: `Other reason`
            }
          ],
          validations: {
            required: {
              params: null,
              message: "A reason is required"
            }
          }
        }
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
        const res = await this.$store.user.cancelSubscription(e);
      } catch (err) {
        throw err;
      }
    }
  },

  created: function () {
    this.initialValues = {
      firstName: this.user.firstName || "",
      lastName: this.user.lastName || ""
    };
  }
};
</script>

<style lang="scss"></style>
