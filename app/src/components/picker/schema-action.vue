<template>
  <div class="c-picker-schema-action">
    <section>
      <article>
        <InputText
          v-model:value="item.title"
          label="Widget title"
          placeholder="What is this widget about?"
        ></InputText>
        <InputText
          v-model:value="item.description"
          label="Widget description"
          placeholder="Instructions about what the button will do"
        ></InputText>
        <InputText
          v-model:value="item.url"
          placeholder="https://api.xyz.com/webhook"
          label="Webhook url*"
          :required="true"
        ></InputText>
        <InputText
          v-model:value="item.buttonText"
          placeholder="Press me"
          label="Button text"
        ></InputText>
        <InputSwitch v-model:value="item.external" label="Is link external?"></InputSwitch>
      </article>
    </section>
    <button :disabled="processing" type="button" class="btn btn-primary" @click="onSave">
      <span v-if="processing" class="c-spinner"></span>
      <span>Save </span>
    </button>
    <div class="c-input c-form__errors" v-if="errors && errors.length > 0">
      <span role="alert" v-for="(error, i) in errors" :key="i">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<script>
import InputText from "@operational.co/components/form/input-text.vue";
import InputSelect from "@operational.co/components/form/input-select.vue";
import InputSwitch from "@operational.co/components/form/input-switch.vue";
import DataSelector from "./data-selector.vue";

export default {
  components: {
    InputText,
    InputSelect,
    InputSwitch,
    DataSelector,
  },

  data: function () {
    return {
      aggregrateOptions: [
        {
          key: "TOTAL",
          value: "TOTAL",
        },
        {
          key: "MAX",
          value: "MAX",
        },
        {
          key: "AVERAGE",
          value: "AVERAGE",
        },
      ],
      dateOptions: [
        {
          key: "7 days",
          value: "7 days",
        },
        {
          key: "30 days",
          value: "30 days",
        },
        {
          key: "60 days",
          value: "60 days",
        },
      ],
      typeOptions: [
        {
          key: "event",
          value: "event",
        },
        {
          key: "category",
          value: "category",
        },
      ],

      item: {
        url: "",
        title: "",
        description: "",
        buttonText: "Press me",
        external: false,
      },

      processing: false,

      errors: [],
    };
  },

  props: {
    dashboardId: {},
  },

  computed: {
    titleOptions: function () {
      let options = [];
      if (this.item.type === "event") {
        let eventNames = this.workspace.eventNames || [];

        for (let i = 0; i < eventNames.length; i++) {
          options.push({
            key: eventNames[i],
            value: eventNames[i],
          });
        }

        return options;
      } else {
        let categories = this.workspace.categories || [];

        for (let i = 0; i < categories.length; i++) {
          let cat = categories[i];
          options.push({
            key: cat.text,
            value: cat.text,
          });
        }

        return options;
      }
    },

    workspace: function () {
      return this.$store.workspace.resource;
    },
  },

  methods: {
    onSave: async function () {
      // validate here
      if (!this.item.url) {
        this.errors.push(`Webhook url is needed`);

        return;
      }

      if (this.processing) {
        return;
      }

      this.errors = [];
      this.processing = true;

      const form = {
        schema: {
          ...this.item,
        },
        type: "ACTION",
        w: 1,
        h: 1,
        dashboardId: this.dashboardId,
      };

      try {
        await this.$store.dashboards.createWidget(form);
        this.$store.app.sendNotification(`Action widget added to dashboard!`);
        await new Promise((r) => setTimeout(r, 500));
        this.$router.push("/dashboards");
      } catch (err) {
        console.log(err);
      }

      this.processing = false;
    },
  },

  created: function () {},
};
</script>

<style lang="scss">
.c-picker-schema-action {
  label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 450;
    font-size: var(--font-size-sm);
  }

  article {
  }
}
</style>
