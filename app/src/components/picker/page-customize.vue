<template>
  <div class="c-picker-page-source">
    <h4>Customize widget</h4>
    <template v-if="type === 'LINE'">
      <InputSelect label="Data source" v-model:value="source" :options="dataSources"></InputSelect>
      <InputSelect label="Widget width" v-model:value="width" :options="widthOptions"></InputSelect>
    </template>

    <template v-if="type === 'STAT'">
      <InputSelect label="Data source" v-model:value="source" :options="dataSources"></InputSelect>
    </template>

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
import widgets from "./widgets.js";
import InputSelect from "@operational.co/components/form/input-select.vue";
import InputText from "@operational.co/components/form/input-text.vue";

export default {
  components: {
    InputSelect,
  },

  props: {
    type: {},
    dashboardId: {},
  },

  data: function () {
    return {
      processing: false,

      source: "EVENTS",
      width: "2",

      widthOptions: [
        {
          key: "2",
          value: "2 tiles",
        },
        {
          key: "4",
          value: "4 tiles",
        },
      ],

      dataSources: [
        {
          key: "EVENTS",
          value: "Events - Visualize data from your tracked events inside Operational",
        },
        {
          key: "PUSH",
          value: "Push - Push data from your own server. We will cache the data on our end",
        },
      ],

      errors: [],
    };
  },

  computed: {
    widgetTypes: function () {
      return widgets;
    },
    currentWidgetType: function () {
      let widgetTypes = this.widgetTypes;

      let type = null;

      for (let i = 0; widgetTypes.length; i++) {
        if (widgetTypes[i].type === this.type) {
          type = widgetTypes[i];
          break;
        }
      }

      return type;
    },
  },

  methods: {
    onSave: async function () {
      if (this.processing) {
        return;
      }

      this.errors = [];

      if (!this.width) {
        this.errors.push(`Select a widget width`);
      }
      if (!this.source) {
        this.errors.push(`Select a data source`);
      }

      if (this.errors.length > 0) {
        return;
      }

      this.processing = true;

      let currentWidgetType = this.currentWidgetType;

      const form = {
        schema: {
          ...currentWidgetType.schema,
        },
        type: this.type,
        w: parseInt(this.width),
        h: 2,
        dashboardId: this.dashboardId,
      };

      if (this.type === "STAT" || this.type === "ACTION") {
        form.w = 1;
        form.h = 1;
      }

      try {
        const widget = await this.$store.dashboards.createWidget(form);
        this.$store.app.sendNotification(`Widget added to dashboard!`);
        this.$store.dashboards.setEdit(widget.id);
        this.$emit("onClose");
      } catch (err) {
        console.log(err);
      }

      this.processing = false;
    },
  },
};
</script>

<style lang="scss">
.c-picker-page-select {
  a {
    display: flex;
    align-items: flex-start;

    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: var(--color-bg-2);
    border-radius: 0.5rem;
    color: var(--color-font) !important;
    cursor: pointer;

    > span {
      display: inline-block;
      width: 48px;
      min-width: 48px;
      height: 48px;
      padding: 0.25rem;
      background: linear-gradient(
        0deg,
        hsl(var(--hue-p), 80%, 45%) 0%,
        hsl(var(--hue-p), 60%, 55%) 30%
      );
      border-radius: 0.4rem;
      margin-right: 0.5rem;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    p {
      font-size: var(--font-size-sm);
      line-height: 1.4;
      opacity: 0.8;
      margin-block-end: 0;
    }

    &:hover,
    &:active {
      background-color: var(--color-bg-3);
    }
  }
}
</style>
