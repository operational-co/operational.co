<template>
  <div class="f-projectname">
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
        projectName: {
          type: "InputText",
          placeholder: "Project name",
          validations: {
            required: {
              params: null,
              message: "You need a project name"
            }
          }
        }
      }
    };
  },

  props: {
    projectName: {}
  },

  computed: {
    initialValues: function () {
      return {
        projectName: this.projectName || ""
      };
    },
    button: function () {
      return {
        text: "Create Project"
      };
    },
    user: function () {
      return this.$store.user.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      const form = {
        name: e.projectName
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
.f-projectname {
}
</style>
