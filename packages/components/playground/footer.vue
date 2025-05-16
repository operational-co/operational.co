<template>
  <div :class="['c-playground-footer', { app: type === app }]">
    <section>
      <InputText label="API key" v-model:value="token" placeholder="Enter your Api key"></InputText>
    </section>

    <div class="spacer"></div>

    <section>
      <span> Language </span>
      <InputSelect label="Code language" :options="codeOptions" v-model:value="currentOption"></InputSelect>
    </section>

    <!-- <section class="advanced">
      <strong>
        <span> test: </span>
        <InputSwitch v-model:value="test"></InputSwitch>
      </strong>
      <small> If set, events will show up as test events. </small>
    </section> -->

    <!-- <section class="advanced">
      <strong>
        <span> notify: </span>
        <InputSwitch v-model:value="notify"></InputSwitch>
      </strong>

      <small> If set, events will send you push notifications when run. </small>
    </section> -->
  </div>
</template>

<script>
import InputText from "@operational.co/components/form/input-text.vue";
import InputSwitch from "@operational.co/components/form/input-switch.vue";
import InputSelect from "@operational.co/components/form/input-select.vue";

export default {
  components: {
    InputText,
    InputSwitch,
    InputSelect
  },

  data: function () {
    return {
      token: "",

      notify: "false",

      codeMode: false,
      currentOption: null,
      codeOptions: [
        {
          key: "nodejssdk",
          value: "Nodejs SDK"
        },
        {
          key: "axios",
          value: "Axios"
        },
        {
          key: "fetch",
          value: "Fetch (pure javascript)"
        },
        {
          key: "curl",
          value: "cURL (command line)"
        }
        // {
        // 	key: "php",
        // 	value: "PHP"
        // },
        // {
        // 	key: "wordpress",
        // 	value: "Wordpress"
        // }
        // {
        // 	key: "python",
        // 	value: "Python"
        // }
      ]
    };
  },

  props: {
    example: {},
    active: {
      type: Boolean,
      default: false
    },
    currentView: {},
    currentCode: {}
  },

  watch: {
    token: function () {
      this.$emit("onTokenUpdate", this.token);
    },
    currentOption: function () {
      this.onOptionChange();
    }
  },

  methods: {
    onClick: function () {
      this.$emit("onClick", this.example);
    },
    onOptionChange() {
      // Emit the selected option to the parent
      this.$emit("update:selectedOption", this.currentOption);
    },
    setToken: function (token) {
      this.token = token;
    }
  },

  created: function () {
    this.currentOption = "nodejssdk";
  }
};
</script>

<style lang="scss">
.c-playground-footer {
  position: relative;
  height: 100%;
  background-color: var(--color-bg-3);
  backdrop-filter: blur(8px);
  border-radius: calc(var(--margin) + var(--border-radius));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0.5rem;

  &.app {
    border-radius: 0;
  }

  .spacer {
    padding: 0.25rem;
  }

  .form-control {
    margin: 0;
  }

  .c-button-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 4px;
    padding: 4px;
    padding-bottom: 2px;
    margin-bottom: -2px;
    border-radius: calc(10px + 4px);
    background-color: var(--color-bg-3);

    .btn {
      height: initial;
      padding: 3px;
    }
  }

  section {
    > span {
      display: none;
      margin-bottom: 0.5rem;
      font-size: var(--font-size-xs);
      line-height: 1;
    }

    .btn-primary {
      min-width: 93px;
    }

    // &.advanced {
    //   padding: var(--margin);
    //   border-radius: var(--border-radius);
    //   margin-top: 1rem;
    //   background-color: var(--color-bg-4);

    //   small {
    //     display: block;
    //     line-height: 1.4;
    //   }

    //   strong {
    //     display: flex;
    //     align-items: center;
    //   }

    //   .c-input-switch {
    //     margin-left: auto;
    //     display: inline-block;
    //   }
    // }
  }

  @media screen and (max-width: 576px) {
    height: auto;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;

    &.app {
      border-radius: var(--border-radius);
    }
  }
}
</style>
