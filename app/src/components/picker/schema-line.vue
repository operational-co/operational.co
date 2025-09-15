<template>
  <div class="c-picker-schema-line">
    <main>
      <InputText
        label="Widget title"
        placeholder="eg: New signups"
        v-model:value="title"
      ></InputText>
      <InputSelect
        label="Metric value"
        v-model:value="metric"
        :options="metricOptions"
      ></InputSelect>
      <InputSelect label="Duration" v-model:value="date" :options="dateOptions"></InputSelect>
      <DataSelector
        v-for="(dataSelector, i) in dataSelectors"
        :key="i"
        :i="i"
        :dataSelector="dataSelector"
        :allowAdd="allowAdd(dataSelector, i)"
        :allowDelete="allowDelete(dataSelector, i)"
        :labelText="`Dataset ${i + 1}`"
        @add="onAdd"
        @delete="onDelete(i)"
        @update="onUpdate"
      ></DataSelector>
      <button :disabled="processing" type="button" class="btn btn-primary" @click="onSave">
        <span v-if="processing" class="c-spinner"></span>
        <span>Update </span>
      </button>
      <div class="c-input c-form__errors" v-if="errors && errors.length > 0">
        <span role="alert" v-for="(error, i) in errors" :key="i">
          {{ error }}
        </span>
      </div>
    </main>
    <Header :schema="schema" type="LINE"></Header>
  </div>
</template>

<script>
import InputSelect from "@operational.co/components/form/input-select.vue";
import InputText from "@operational.co/components/form/input-text.vue";
import DataSelector from "./data-selector.vue";
import Header from "./header.vue";

export default {
  components: {
    InputSelect,
    InputText,
    DataSelector,
    Header,
  },

  data: function () {
    return {
      title: "",
      metric: "TOTAL",
      date: "7 days",
      dataSelectors: [
        {
          selector: "event",
          text: "",
        },
      ],
      metricOptions: [
        {
          key: "TOTAL",
          value: "TOTAL",
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
        {
          key: "1 year",
          value: "1 year",
        },
      ],
      limit: 4,
      errors: [],
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
        title: this.title,
        metric: this.metric,
        date: this.date,
        dataSelectors: this.dataSelectors,
      };

      return schema;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    isMax: function () {
      if (this.dataSelectors.length === this.limit) {
        return true;
      }
      return false;
    },
  },

  methods: {
    allowAdd: function (dataSelector, i) {
      if (this.isMax) {
        return false;
      }
      if (this.dataSelectors.length === i + 1) {
        return true;
      }
      return false;
    },
    allowDelete: function (dataSelector, i) {
      if (i === 0) {
        return false;
      }

      return true;
    },
    onSave: async function () {
      if (this.processing) {
        return;
      }
      this.errors = [];
      if (!this.dataSelectors) {
        this.errors.push(`No dataset selected`);
      }
      for (let i = 0; i < this.dataSelectors.length; i++) {
        if (!this.dataSelectors[i].text) {
          this.errors.push(`No event selected for dataset ${i + 1}`);
        }
      }
      if (this.errors.length > 0) {
        return;
      }

      this.processing = true;

      const form = {
        schema: {
          title: this.title,
          metric: this.metric,
          date: this.date,
          dataSelectors: this.dataSelectors,
        },
        type: "LINE",
        w: 2,
        h: 2,
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
    onAdd: function () {
      this.dataSelectors.push({
        selector: "event",
        text: "",
      });
    },
    onDelete: function (i) {
      this.dataSelectors.splice(i, 1);
    },
    onUpdate: function (data) {
      let newObj = {
        ...data,
      };
      delete newObj.i;
      this.dataSelectors.splice(data.i, 1, newObj);
    },
  },

  mounted: function () {
    if (this.currentWidget) {
      let schema = this.currentWidget.schema;
      this.title = schema.title;
      this.metric = schema.metric;
      this.date = schema.date;
      this.dataSelectors = schema.dataSelectors;
    }
  },
};
</script>

<style lang="scss">
.c-picker-schema-line {
  display: grid;
  grid-template-columns: 1fr 340px;

  main {
    padding-right: 1rem;
  }
}
</style>
