<template>
  <div class="c-picker">
    <Constrain>
      <!-- <Breadcrumb></Breadcrumb> -->
      <h2>Add Widget</h2>
      <p>Widgets will show up in your dashboard. You can update them later on.</p>

      <div class="c-picker__list" v-if="!type">
        <h4>Select a chart</h4>
        <a @click="onSelectChart('line')">
          <span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 11L17.7071 9.70711C17.3166 9.31658 16.6834 9.31658 16.2929 9.70711L12.7071 13.2929C12.3166 13.6834 11.6834 13.6834 11.2929 13.2929L10.2071 12.2071C9.81658 11.8166 9.18342 11.8166 8.79289 12.2071L4 17M4 4V17M20 20H5C4.44772 20 4 19.5523 4 19V17"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <article>
            <strong> Line chart </strong>
            <p>Great for showcasing trends, eg: user signups, cancellations, etc.</p>
          </article>
        </a>
        <!-- <a @click="onSelectChart('bar')">
          <strong> Bar chart </strong>
          <p>Similar to the line chart but better at comparing two or more different datasets.</p>
        </a> -->
        <a @click="onSelectChart('stat')">
          <span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0039 17V14M18 5H20C20.5523 5 21 5.44772 21 6V7C21 8.65685 19.6569 10 18 10M6 5H4C3.44772 5 3 5.44772 3 6V7C3 8.65685 4.34315 10 6 10M12 14C8.68629 14 6 11.3137 6 8V4C6 3.44772 6.44772 3 7 3H17C17.5523 3 18 3.44772 18 4V8C18 11.3137 15.3137 14 12 14ZM17 20V18C17 17.4477 16.5523 17 16 17H8C7.44772 17 7 17.4477 7 18V20C7 20.5523 7.44772 21 8 21H16C16.5523 21 17 20.5523 17 20Z"
                stroke="currentColor"
                stroke-width="1"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <article>
            <strong> Stat </strong>
            <p>Great for showcasing a single metric, eg no of users signed up.</p>
          </article>
        </a>
        <a @click="onSelectChart('action')">
          <span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7C19 8.10457 15.866 9 12 9C8.13401 9 5 8.10457 5 7M19 7C19 5.89543 15.866 5 12 5C8.13401 5 5 5.89543 5 7M19 7V14C19 15.1046 15.866 16 12 16C8.13401 16 5 15.1046 5 14V7M5 14.1067C3.14864 14.6253 2 15.3479 2 16.1471C2 17.7251 6.47715 19.0043 12 19.0043C17.5228 19.0043 22 17.7251 22 16.1471C22 15.3479 20.8514 14.6253 19 14.1067"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="square"
              />
            </svg>
          </span>

          <article>
            <strong> Action button </strong>
            <p>
              Use Action buttons to trigger webhooks on your server. For instance, you can pair it
              up with a function on your server to generate and mail yourself a GST csv.
            </p>
          </article>
        </a>
        <!-- <a @click="onSelectChart('events-list')">
          <strong> Event list </strong>
          <p>Simple list of top 5 or 10 most popular events</p>
        </a> -->
      </div>

      <div class="c-picker__form" v-if="type">
        <Header></Header>
        <h4>Configure {{ type }} chart</h4>
        <p>Stats shows simple metrics, eg x no of signups over last 7 days.</p>
        <p>Great for showcasing simple but specific stats.</p>
        <SchemaLine v-if="type === 'line'" :dashboardId="currentDashboard.id"></SchemaLine>
        <SchemaStat v-if="type === 'stat'" :dashboardId="currentDashboard.id"></SchemaStat>
        <SchemaAction v-if="type === 'action'" :dashboardId="currentDashboard.id"></SchemaAction>
      </div>

      <!-- <article class="c-picker__summary" v-if="type">
        <p>
          {{ summary }}
        </p>
      </article> -->
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import DataSelector from "./data-selector.vue";
import SchemaLine from "./schema-line.vue";
import SchemaStat from "./schema-stat.vue";
import SchemaAction from "./schema-action.vue";
import Header from "./header.vue";
import Breadcrumb from "./breadcrumb.vue";

export default {
  components: {
    Constrain,
    DataSelector,
    SchemaLine,
    SchemaStat,
    SchemaAction,
    Header,
    Breadcrumb,
  },

  data: function () {
    return {
      type: "",
      dataSelectors: [
        {
          selector: "event",
          condition: "=",
          text: "",
        },
      ],
    };
  },

  computed: {
    dashboards: function () {
      return this.$store.dashboards.resources;
    },
    // will need to rectify this in the future
    currentDashboard: function () {
      return this.dashboards[0];
    },
    limit: function () {
      let limit = 0;
      if (this.type === "line") {
        limit = 4;
      }
      if (this.type === "bar") {
        limit = 2;
      }
      if (this.type === "stat") {
        limit = 1;
      }
      return limit;
    },
    isMax: function () {
      if (this.dataSelectors.length === this.limit) {
        return true;
      }
      return false;
    },
    summary: function () {
      let chartType = this.type;
      let dataSelectors = this.dataSelectors;
      let lines = [];
      let line1 = `This ${chartType} will show ${dataSelectors.length} datasets where:`;
      lines.push(line1);
      for (let i = 0; i < dataSelectors.length; i++) {
        let dataSelector = dataSelectors[i];

        let condition = dataSelector.condition;
        if (condition === "=") {
          condition = "is";
        } else {
          condition = "is not";
        }

        let line = `${i + 1}) Data where ${dataSelector.selector} ${condition} "${dataSelector.text}"`;
        lines.push(line);
      }

      lines = lines.join(`\n`);

      return lines;
    },
  },

  methods: {
    onSave: function () {
      // validate here
    },
    onAdd: function () {
      this.dataSelectors.push({
        selector: "event",
        condition: "=",
        text: "",
      });
    },
    onDelete: function (i) {
      console.log(i);
      this.dataSelectors.splice(i, 1);
    },
    onUpdate: function (data) {
      console.log(data);
      let newObj = {
        ...data,
      };
      delete newObj.i;
      this.dataSelectors.splice(data.i, 1, newObj);
    },
    onSelectChart: function (type) {
      this.type = type;
    },
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
  },
};
</script>

<style lang="scss">
.c-picker {
  &__list {
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
        background: linear-gradient(0deg, rgba(26, 153, 156, 1) 0%, rgba(36, 201, 97, 1) 100%);
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

  &__summary {
    border-radius: 1rem;
    padding: 1rem;
    background-color: hsl(var(--hue-orange), 40%, 3%);
    color: var(--color-warning);
    white-space: break-spaces;

    p {
      margin-block-end: 0;
    }
  }
}
</style>
