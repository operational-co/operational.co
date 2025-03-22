<template>
  <div class="p-login">
    <Constrain>
      <article>
        <h1>Operational.co</h1>
        <p>Untangling your business ops.</p>
      </article>
      <FormLogin></FormLogin>
      <div>
        <p>Not a member yet? <router-link to="/signup">Signup now</router-link></p>
        <p>Forgot your password? <router-link to="/password-reset">Reset it now</router-link></p>
      </div>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Modal from "@operational.co/components/ui/modal.vue";
import FormLogin from "@operational.co/components/form/form-login.vue";

export default {
  components: {
    Constrain,
    Modal,
    FormLogin,
  },

  beforeRouteEnter: async function (to, from, next) {
    next((vm) => {
      vm.$store.events.refresh();
    });
  },
};
</script>

<style lang="scss">
.p-login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-2);
  display: flex;
  align-items: center;
  justify-content: center;

  article {
    text-align: center;
  }

  h1 {
    font-family: "PP Editorial New";
    font-weight: 500;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-color: linear-gradient(180deg, #fff 45%, rgba(255, 255, 255, 0.6));
    background-image: linear-gradient(180deg, #fff 45%, rgba(255, 255, 255, 0.6));
  }
}
</style>
