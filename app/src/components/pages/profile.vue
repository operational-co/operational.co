<template>
  <div class="p-profile">
    <Profile></Profile>
  </div>
</template>

<script>
import Profile from "@/components/profile/index.vue";
export default {
  components: {
    Profile,
  },

  beforeRouteEnter: async function (to, from, next) {
    next((vm) => {
      //vm.$store.activity.refresh();
    });
  },
};
</script>

<style lang="scss"></style>
