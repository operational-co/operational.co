<template>
  <div class="c-project-empty">
    <Constrain>
      <section>
        <h2>You don't have any projects</h2>
        <p>Create a project to start tracking events.</p>
        <button class="btn btn-primary" type="button" @click="createProject">Create project</button>
      </section>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";

export default {
  components: {
    Constrain,
  },

  methods: {
    createProject: function () {
      this.$store.app.setCreateWorkspace(true);
    },
  },
};
</script>

<style lang="scss">
.c-project-empty {
  section {
    margin-top: 2rem;
    padding: 1rem;
    background-color: var(--color-bg-2);
    border-radius: var(--border-radius-lg);
  }

  p {
    margin-bottom: 1rem;
  }
}
</style>
