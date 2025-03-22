<template>
  <div class="c-docs-structured">
    <Tabs :options="{ useUrlFragment: false }">
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

    <Tabs :options="{ useUrlFragment: false }">
      <Tab name="Nodejs">
        <Code :text="codeNodejs2"></Code>
      </Tab>
      <Tab name="Axios">
        <Code :text="codeAxios2"></Code>
      </Tab>
      <Tab name="cURL">
        <Code :text="codeCurl2"></Code>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Content, {
  frontmatter,
} from "@operational.co/content/manual/introduction.mdx";
import Sidebar from "./sidebar.vue";
import Code from "@operational.co/components/code/index.vue";
import { Tabs, Tab } from "vue3-tabs-component";

export default {
  components: {
    Constrain,
    Content,
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
  type : 'json',
  content : { //json object
    key : "value"
  }
})
`;
    },
    codeAxios: function () {
      // prettier-ignore
      return `import axios from 'axios';

const url = "${this.baseApiUrl}/api/v1/log";
const event = {
  name : "My first event",
  type : 'json',
  content : { //json object
    key : "value"
  }
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
  "${this.baseApiUrl}/api/v1/log" \
  -H "Authorization: Bearer ${this.apikey}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My first event",
    "type": "rows",
    "content": [
      {
        "label" : "Name",
        "content" : "Shash"
      }
    ]
  }'
`;
    },

    codeNodejs2: function () {
      // prettier-ignore
      return `import Operational from "@operational.co/sdk"

const ops = new Operational("${this.apikey}");

ops.events.ingest({
  name : "My first event",
  type : 'json',
  content : { //json object
    key : "value"
  }
})
`;
    },
    codeAxios2: function () {
      // prettier-ignore
      return `import axios from 'axios';

const url = "${this.baseApiUrl}/api/v1/log";
const event = {
  name : "My first event",
  type : 'json',
  content : { //json object
    key : "value"
  }
}
const config = {
  header : {
    Authorization : "Bearer ${this.apikey}"
  }
}
await axios.post(url, event, config);
`;
    },
    codeCurl2: function () {
      // prettier-ignore
      return `curl -X POST \
  "${this.baseApiUrl}/api/v1/log" \
  -H "Authorization: Bearer ${this.apikey}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My first event",
    "type": "json",
    "content": {
      "key": "value"
    }
  }'
`;
    },
  },
};
</script>

<style lang="scss">
.c-docs-structured {
}
</style>
