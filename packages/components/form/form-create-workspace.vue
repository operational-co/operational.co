<template>
  <div class="f-create-workspace">
    <Form
      :button="button"
      v-if="initialValues"
      :initialValues="initialValues"
      :schema="schema"
      :submissionFx="submissionFx"
    ></Form>
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
        text: "Create"
      },

      schema: {
        name: {
          label: "Project name",
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
    user: function () {
      return this.$store.user.resource;
    }
  },

  methods: {
    async submissionFx(e) {
      try {
        const res = await this.$store.workspace.create(e);
        //console.log(res);
      } catch (err) {
        throw err;
      }

      window.location.reload();
    }
  },

  mounted: function () {
    this.initialValues = {};
  }
};
</script>

<style lang="scss"></style>
