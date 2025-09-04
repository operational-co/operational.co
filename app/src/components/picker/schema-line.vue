<template>
  <div class="c-picker-schema-line">
    {{ dataSelectors }}
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
    <button type="button" class="btn btn-primary" @click="onSave">
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
import DataSelector from "./data-selector.vue";

export default {
  components: {
    InputText,
    DataSelector,
  },

  data: function () {
    return {
      dataSelectors: [
        {
          selector: "event",
          condition: "=",
          text: "",
        },
      ],
      limit: 4,
      errors: [],
      processing: false,
    };
  },

  props: {
    dashboardId: {},
  },

  computed: {
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
          dataSelectors: this.dataSelectors,
        },
        type: "LINE",
        w: 2,
        h: 2,
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
    onAdd: function () {
      this.dataSelectors.push({
        selector: "event",
        condition: "=",
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
};
</script>

<style lang="scss"></style>
