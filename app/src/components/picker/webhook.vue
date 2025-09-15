<template>
  <div class="c-picker-webhook">
    <p>
      <strong>Send your server's data to us!</strong>
    </p>
    <p>Here's how it works:</p>
    <p>You push widget data at {{ webhook }}</p>
    <p>You return data in a specific format.</p>
    <p>If it works, we'll cache the data and show it inside the widget.</p>
    <strong> Quick start: </strong>
    <p>Paste this code inside your server:</p>
    <Code :text="codeText"></Code>
    <p>If you get a 201 status back, it worked!</p>
    <p>
      For complete docs, visit
      <a href="https://operational.co/api/dashboard-introduction"
        >operational.co/api/dashboard-introduction</a
      >
    </p>
  </div>
</template>

<script>
import InputSelect from "@operational.co/components/form/input-select.vue";
import InputText from "@operational.co/components/form/input-text.vue";
import Code from "@operational.co/components/code/index.vue";

export default {
  components: {
    InputSelect,
    InputText,
    Code,
  },

  data: function () {
    return {
      codeText: `import axios from "axios";

const url = "https://api.operational.co/api/v1/widgets/28";

const payload = {
  title: "10,477",
  subtitle: "Total user signups",
  data: [
    {
      data: [
        {
          x: '2025-09-15T06:40:35+00:00',
          y: 5,
          label: '5 User signups today',
        },
      ],
    },
  ],
};

const res = await axios.post(url, payload, {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 123",
  },
});

console.log('Status:', res.status)`,
      data: {
        title: "10,477",
        subtitle: "Total user signups",
        data: [
          {
            data: [
              {
                x: `2025-09-15T06:40:35+00:00`,
                y: 5,
                label: `5 User signups today`,
              },
            ],
          },
        ],
      },
    };
  },

  computed: {
    webhook: function () {
      return `https://api.operational.co/`;
    },
    duration: function () {
      return `10 minutes`;
    },
  },
};
</script>

<style lang="scss">
.c-picker-webhook {
}
</style>
