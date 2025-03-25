<template>
  <div class="c-docs">
    <Tabs>
      <Tab name="Nodejs">
        <Code :text="codeNodejs"></Code>
      </Tab>
      <Tab name="Axios">
        <Code :text="codeAxios"></Code>
      </Tab>
      <Tab name="cURL">
        <Code :text="codeCurl"></Code>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Sidebar from "./sidebar.vue";
import Code from "@operational.co/components/code/index.vue";
import { Tabs, Tab } from "vue3-tabs-component";

export default {
  components: {
    Constrain,
    Sidebar,
    Code,
    Tabs,
    Tab,
  },

  props: {
    apikey: {},
    baseApiUrl: {},
  },

  computed: {
    codeNodejs: function () {
      // prettier-ignore
      return `import Operational from "@operational.co/sdk"

const ops = new Operational("${this.apikey}");

ops.events.ingest({
  name : "My first event",
  avatar : "😃" // optional but recommended
})
`;
    },
    codeAxios: function () {
      // prettier-ignore
      return `import axios from 'axios';

const url = "${this.baseApiUrl}/api/v1/log";
const event = {
  name : "My first event",
  avatar : "😃"
}
const config = {
  header : {
    Authorization : "Bearer ${this.apikey}"
  }
}
await axios.post(url, event, config);
`;
    },
    codeCurl: function () {
      // prettier-ignore
      return `curl -X POST \
${this.baseApiUrl}/api/v1/log \
-H 'Authorization: Bearer ${this.apikey}' \
-H 'Content-Type: application/json' \
-d '{
  "name": "My first event",
  "avatar" : "😃"
}'
`;
    },
  },
};
</script>

<style lang="scss">
.c-docs-track {
}
</style>
