<template>
  <div class="c-onboarding-project">
    <Constrain size="sm">
      <article>
        <h3>Last bit..</h3>

        <FormStats @onSubmit="onSubmit"></FormStats>
      </article>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import FormStats from "@operational.co/components/form/form-stats.vue";
export default {
  components: {
    Constrain,
    FormStats,
  },

  data: function () {
    return {
      placeholder: "Project name",
      projectName: "",
    };
  },

  computed: {},

  methods: {
    onSubmit: function () {
      this.$emit("onNext");
    },
  },
};
</script>

<style lang="scss">
.c-onboarding-project {
  .btn {
    &.btn-wide {
      width: auto;
    }
  }
}
</style>
