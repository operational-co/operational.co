<template>
  <div :class="['card-text', { 'variant-muted': variant === 'muted' }]">
    <label v-if="label">
      {{ label }}
    </label>
    <span>
      {{ text }}
    </span>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    payload: {}
  },

  computed: {
    label: function () {
      return this.payload.label || null;
    },
    text: function () {
      let text = this.payload.content;

      if (text) {
        text = this.checkDate(text);
      }

      return text || "\b";
    },
    variant: function () {
      return this.payload.variant || "";
    }
  },

  methods: {
    checkDate: function (text) {
      if (text.length > 24) {
        return text;
      }

      if (!moment(text, moment.ISO_8601).isValid()) {
        return text;
      }

      if (!isNaN(parseInt(text))) {
        return text;
      }

      return moment(text).format("hh:mm a, Do MMM");
    }
  }
};
</script>

<style lang="scss">
.card-text {
  &.variant-muted {
    font-size: var(--font-size-xs);
    opacity: 0.8;
    line-height: 1.2;
  }

  label {
    display: block;
    font-size: var(--font-size-xs);
    opacity: 0.8;
    line-height: 1.2;
  }

  > span {
    word-break: break-all;
  }

  @media screen and (max-width: 576px) {
    > span {
      font-size: var(--font-size-sm);
    }
  }
}
</style>
