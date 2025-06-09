<template>
  <div class="f-variable-to-static">
    <Form :processing="processing" :button="button" :schema="schema" :submissionFx="submissionFx"></Form>
  </div>
</template>

<script>
import Form from "./index.vue";
import utils from "@operational.co/lib/utils.js";
import uploadFonts from "@/lib/upload-fonts.js";

export default {
  components: {
    Form
  },

  data: function () {
    return {
      schema: {
        font: {
          label: "Upload fonts",
          type: "InputUpload",
          placeholder: "",
          validations: {}
        }
      },
      processing: false,
      button: {
        text: "Upload fonts"
      }
    };
  },

  computed: {
    user: function () {
      return {};
    }
  },

  methods: {
    async submissionFx(e) {
      if (!e.font) {
        return;
      }
      let form = new FormData();

      form.append("font", e.font[0]);

      try {
        const res = await uploadFonts(form);
      } catch (err) {
        throw err;
      }
    }
  }
};
</script>

<style lang="scss"></style>
