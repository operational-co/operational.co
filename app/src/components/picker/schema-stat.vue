<template>
  <div class="c-picker-schema-stat">
    <main>
      <section>
        <article>
          <InputText
            label="Icon"
            :max="1"
            v-model:value="item.icon"
            placeholder="Enter a emoji"
            :maxlength="2"
          ></InputText>
          <InputSelect label="Type" v-model:value="item.type" :options="typeOptions"></InputSelect>
          <InputSelect
            label="Type selection"
            v-model:value="item.title"
            :options="titleOptions"
          ></InputSelect>
          <InputSelect
            label="Aggregate"
            v-model:value="item.aggregrate"
            :options="aggregrateOptions"
          ></InputSelect>
          <InputSelect
            label="Duration"
            v-model:value="item.date"
            :options="dateOptions"
          ></InputSelect>
        </article>
      </section>
      <button :disabled="processing" type="button" class="btn btn-primary" @click="onSave">
        <span v-if="processing" class="c-spinner"></span>
        <span>Save </span>
      </button>
    </main>
    <Header :schema="schema" type="STAT"></Header>
  </div>
</template>

<script>
import InputText from "@operational.co/components/form/input-text.vue";
import InputSelect from "@operational.co/components/form/input-select.vue";
import DataSelector from "./data-selector.vue";
import Header from "./header.vue";

export default {
  components: {
    InputText,
    InputSelect,
    DataSelector,
    Header,
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
        icon: "🏆",
        type: "event",
        title: "User signups",
        aggregate: "TOTAL",
        date: "7 days",
      },

      processing: false,
    };
  },

  props: {
    widgetId: {},
    currentWidget: {},
  },

  computed: {
    schema: function () {
      let schema = {
        ...this.item,
      };

      return schema;
    },
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
        widgetId: this.widgetId,
      };

      try {
        await this.$store.dashboards.updateWidget(form);
        this.$store.app.sendNotification(`Widget updated`);
        await new Promise((r) => setTimeout(r, 500));
        this.$router.push("/dashboards");
      } catch (err) {
        console.log(err);
      }

      this.processing = false;
    },
  },

  mounted: function () {
    if (this.currentWidget) {
      this.item = {
        ...this.currentWidget.schema,
      };
    }
  },
};
</script>

<style lang="scss">
.c-picker-schema-stat {
  display: grid;
  grid-template-columns: 1fr 340px;

  label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 450;
    font-size: var(--font-size-sm);
  }

  article {
    display: grid;
    grid-template-columns: max-content max-content 1fr;
    grid-column-gap: 0.5rem;
  }

  main {
    padding-right: 1rem;
  }

  @media screen and (max-width: 576px) {
    display: block;

    main {
      padding-right: 0;
    }

    .c-picker-header {
      display: none;
    }
  }
}
</style>
