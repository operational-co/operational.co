<template>
  <component :is="resolveComponent(payload.type || '')" :payload="payload"></component>
</template>

<script>
import Text from "./text.vue";
import Spacer from "./spacer.vue";
import Divider from "./divider.vue";
import Map from "./map.vue";
import Json from "./json.vue";
//import Chart from "./chart.vue";
import Image from "./image.vue";
import Cards from "./cards.vue";

import { defineAsyncComponent } from "vue";

export default {
  components: {
    Text,
    Spacer,
    Divider,
    Map,
    Json,
    //Chart,
    Image,
    Cards,
    Row: defineAsyncComponent(() => Promise.resolve(import("./row.vue"))),
    Column: defineAsyncComponent(() => Promise.resolve(import("./column.vue")))
  },

  props: {
    payload: {}
  },

  computed: {},

  methods: {
    resolveComponent: function (type) {
      if (type === "rows") {
        return "Row";
      }

      if (type === "column") {
        return "Column";
      }

      if (type === "spacer") {
        return "Spacer";
      }

      if (type === "divider") {
        return "Divider";
      }

      if (type === "map") {
        return "Map";
      }

      if (type === "json") {
        return "Json";
      }

      if (type === "Chart") {
        return "Chart";
      }

      if (type === "image") {
        return "Image";
      }

      if (type === "cards") {
        return "Cards";
      }

      return "Text";
    }
  }
};
</script>

<style></style>
