<template>
  <div class="c-picker-schema-action">
    <section>
      <article>
        <InputText
          v-model:value="item.url"
          placeholder="https://api.xyz.com/webhook"
          label="Webhook url"
        ></InputText>
        <InputSelect v-model:value="item.title" :options="titleOptions"></InputSelect>
      </article>
    </section>
    <button type="button" class="btn btn-primary" @click="onSave">Save</button>
  </div>
</template>

<script>
import InputText from "@operational.co/components/form/input-text.vue";
import InputSelect from "@operational.co/components/form/input-select.vue";
import DataSelector from "./data-selector.vue";

export default {
  components: {
    InputText,
    InputSelect,
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
        type: "event",
        title: "User signups",
      },

      processing: false,
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
      if (this.processing) {
        return;
      }

      this.processing = true;

      const form = {
        schema: {
          ...this.item,
        },
        type: "STAT",
        w: 1,
        h: 1,
        dashboardId: this.dashboardId,
      };

      try {
        await this.$store.dashboards.createWidget(form);
        this.$store.app.sendNotification(`Line chart Widget added to dashboard!`);
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
    display: grid;
    grid-template-columns: max-content max-content 1fr max-content max-content;
    grid-column-gap: 0.5rem;
  }
}
</style>
