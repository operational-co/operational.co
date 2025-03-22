<template>
  <div class="f-stats">
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
        project_type: {
          label: "What are you building?",
          type: "InputCheckboxGroup",
          validations: {
            required: {
              params: null,
              message: "You need to select at least one option."
            }
          },
          options: [
            {
              key: "SaaS"
            },
            {
              key: "Internal company tool"
            },
            {
              key: "IoT"
            },
            {
              key: "Wordpress"
            },
            {
              key: "Other"
            }
          ]
        },
        tech: {
          label: "What tech are you using?",
          type: "InputCheckboxGroup",
          validations: {
            required: {
              params: null,
              message: "You need to select at least one option."
            }
          },
          options: [
            {
              key: "Nodejs"
            },
            {
              key: "Javascript(frontend)"
            },
            {
              key: "PHP"
            },
            {
              key: "Ruby"
            },
            {
              key: "Other"
            }
          ]
        }
      }
    };
  },

  computed: {
    button: function () {
      return {
        text: "Finish onboarding"
      };
    },
    user: function () {
      return this.$store.user.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      console.log(e);
      const form = {
        meta: e
      };
      try {
        const res = await this.$store.workspace.update(form);
        this.$emit("onSubmit", res);
      } catch (err) {
        throw err;
      }
    }
  }
};
</script>

<style lang="scss">
.f-stats {
}
</style>
