<template>
  <div class="f-user">
    <h3>Update your details</h3>
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
        firstName: {
          label: "First Name",
          type: "InputText",
          placeholder: "",
          validations: {
            required: {
              params: null,
              message: "First name is required"
            }
          }
        },
        lastName: {
          label: "Last Name",
          type: "InputText",
          placeholder: "",
          validations: {
            required: {
              params: null,
              message: "Last name is required"
            }
          }
        },
        avatar: {
          label: "Profile picture",
          type: "InputAvatar",
          placeholder: "",
          validations: {}
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
      console.log(e);
      try {
        const res = await this.$store.user.update(e);
        //console.log(res);
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
      avatar: this.user.avatar,
      firstName: this.user.firstName,
      lastName: this.user.lastName
    };
  }
};
</script>

<style lang="scss"></style>
