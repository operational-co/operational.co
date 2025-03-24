<template>
  <div class="c-onboarding-project">
    <Constrain size="sm">
      <article>
        <h3>Setup your project</h3>
        <p>
          In Operational, all your events, billing and user accounts belongs to
          a project.
        </p>

        <p>Let's setup your first project:</p>
        {{ projectName }}
        <FormProjectname @onSubmit="onSubmit"></FormProjectname>
        <!-- <button class="btn btn-primary" @click="$emit('onNext')">Next</button> -->
      </article>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import FormProjectname from "@operational.co/components/form/form-projectname.vue";
export default {
  components: {
    Constrain,
    FormProjectname,
  },

  data: function () {
    return {
      placeholder: "Project name",
      projectName: "",
    };
  },

  computed: {
    apikey: function () {
      return "ops_123123123";
    },
  },

  methods: {
    onSubmit: function () {
      this.$store.app.sendNotification(`Project created!`);
      this.$emit("onNext");
    },
  },
};
</script>

<style lang="scss">
.c-onboarding-project {
}
</style>
