<template>
  <div class="c-form">
    <VeeForm
      ref="form"
      @input="onChange"
      @submit="onSubmit"
      :initialValues="initialValues"
      :validation-schema="validationSchema"
      v-slot="{ isSubmitting }"
    >
      <div class="c-form__body">
        <div class="c-form__input" v-for="(input, name) in schema" :key="name">
          <div class="c-input">
            <VeeField :name="name" v-slot="{ handleChange, value }">
              <component
                :is="getComponent(input)"
                :name="name"
                :handleChange="handleChange"
                :value="value"
                :label="input.label"
                placeholder=""
                v-bind="input"
              ></component>
            </VeeField>
            <VeeErrorMessage :name="name" />
          </div>
        </div>
      </div>
      <div class="c-form__footer">
        <button :disabled="isSubmitting" class="btn btn-primary btn-box">
          <span v-if="isSubmitting" class="c-spinner"></span>
          {{ buttonText }}
        </button>
        <div class="c-input c-form__errors" v-if="errors && errors.length > 0">
          <span role="alert" v-for="(error, i) in errors" key="i">
            {{ error.message }}
          </span>
        </div>
      </div>
    </VeeForm>
  </div>
</template>

<script>
import { Form as VeeForm } from "vee-validate";
import { Field as VeeField } from "vee-validate";
import { ErrorMessage as VeeErrorMessage } from "vee-validate";
import InputText from "./input-text.vue";
import InputEmail from "./input-email.vue";
import InputPassword from "./input-password.vue";
import InputSelect from "./input-select.vue";
import InputSwitch from "./input-switch.vue";
import InputTimezone from "./input-timezone.vue";
import InputAvatar from "./input-avatar.vue";
import InputUpload from "./input-upload.vue";
import InputRadio from "./input-radio.vue";
import InputCheckboxGroup from "./input-checkbox-group.vue";
import errorHandler from "./error-handler.js";

export default {
  components: {
    VeeForm,
    VeeField,
    VeeErrorMessage,
    InputText,
    InputEmail,
    InputPassword,
    InputSelect,
    InputSwitch,
    InputTimezone,
    InputAvatar,
    InputUpload,
    InputRadio,
    InputCheckboxGroup
  },

  data: function () {
    return {
      errors: []
    };
  },

  watch: {
    values: function () {},
    initialValues: {
      handler: function () {},
      deep: true
    }
  },

  props: {
    schema: {},
    initialValues: {},
    button: {
      type: Object,
      default: function () {
        return {
          type: Object,
          default: {
            text: "Submit"
          }
        };
      }
    },
    submissionFx: {
      type: Function,
      default: function () {}
    }
  },

  computed: {
    buttonText: function () {
      if (this.button && this.button.text) {
        return this.button.text;
      }
      return "Update";
    },
    validationSchema: function () {
      let s = this.schema;

      let validations = {};

      for (const key in s) {
        validations[key] = (value) => {
          let fieldValidations = s[key].validations;

          if (!fieldValidations) {
            return true;
          }

          let message = errorHandler(fieldValidations, value);
          return message;
        };
      }

      return validations;
    }
  },

  methods: {
    onChange: function (e) {
      let values = this.$refs.form.getValues();

      this.$emit("onChange", values);
    },
    setValues: function (obj) {
      this.$refs.form.setValues(obj);
    },
    computeValidations: function (validations, value) {
      let message = errorHandler(validations, value);
      if (typeof message !== "string") {
        message = true;
      }
      return message;
    },
    onInvalidSubmit: function (e) {},
    async onSubmit(e) {
      try {
        const res = await this.submissionFx(e);
      } catch (err) {
        console.log(err);
        this.errors = [err || { message: "Something went wrong, please try again" }];
        return;
      }
      this.errors = [];
      this.$emit("onSubmit", e);
    },
    getComponent: function (input) {
      return input.type || "InputText";
    }
  },

  mounted: function () {}
};
</script>

<style lang="scss">
.c-form {
  &__errors {
    padding-top: 8px;
  }
}
</style>
