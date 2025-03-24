<template>
  <div class="card-row">
    <template v-if="content">
      <div class="card-row__item" v-for="(data, i) in content || []" key="i">
        <Resolve :payload="data"></Resolve>
      </div>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import Resolve from "./resolve.vue";

function isValidDate(dateString) {
  return moment(dateString, moment.ISO_8601, true).isValid();
}

export default {
  components: {
    Resolve
  },

  props: {
    payload: {}
  },

  computed: {
    content: function () {
      let content = this.payload.content || [];

      if (typeof content === "object") {
        return content;
      }

      try {
        content = JSON.parse(content);
      } catch (err) {
        content = `{}`;
      }

      content = JSON.parse(JSON.stringify(content));

      if (this.variant === "timeline") {
        content = this.generateTimelineContent(content);
      }

      return content;
    },
    variant: function () {
      return "";
    },
    gapSize: function () {
      return "m";
    }
  },

  methods: {
    generateTimelineContent: function (content) {
      let last = null;
      let start = null;
      let end = null;
      let newContent = [];
      for (let i = 0; i < content.length; i++) {
        let block = content[i];

        let diff = null;
        let type = "";

        if (block.type !== "text") {
          newContent.push(block);
          continue;
        }

        if (!isValidDate(block.content)) {
          newContent.push(block);
          continue;
        }

        if (last) {
          type = "hours";
          diff = moment(block.content).diff(last, "hours");

          if (diff < 2) {
            type = "minutes";
            diff = moment(block.content).diff(last, "minutes");
          }

          if (diff > 72) {
            type = "days";
            diff = moment(block.content).diff(last, "days");
          }

          newContent.push({
            type: "divider",
            content: `${diff} ${type}`
          });
        }

        if (i === 0) {
          last = moment(block.content);
          start = moment(block.content);
        } else {
          last = moment(block.content);
        }

        newContent.push(block);
      }

      return newContent;
    }
  }
};
</script>

<style lang="scss">
.card-row {
  display: grid;
  grid-auto-flow: row;
  gap: var(--margin);

  &__item {
    min-width: 0;
  }
}
</style>
