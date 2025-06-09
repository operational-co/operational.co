<template>
  <div class="f-user">
    <h3>Update project details</h3>
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
        name: {
          label: "Project Name",
          type: "InputText",
          placeholder: "",
          validations: {
            required: {
              params: null,
              message: "Name is required"
            }
          }
        }
      }
    };
  },

  computed: {
    workspace: function () {
      return this.$store.workspace.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.workspace.update(e);
        this.$store.app.sendNotification({
          message: "Profile settings updated"
        });
      } catch (err) {
        throw err;
      }
    }
  },

  mounted: function () {
    this.initialValues = {
      name: this.workspace.name
    };
  }
};
</script>

<style lang="scss"></style>
