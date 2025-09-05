<template>
  <div class="c-picker-preview">
    <Widget :widget="fakeWidget"></Widget>
  </div>
</template>

<script>
import Widget from "@/components/widget/index.vue";
export default {
  components: {
    Widget,
  },

  computed: {
    fakeWidget: function () {
      let obj = {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: "STAT",
        schema: {
          title: "Stat",
        },
      };
      return obj;
    },
  },
};
</script>

<style lang="scss">
.c-picker-preview {
  width: 340px;
  height: 340px;
  background-color: var(--color-bg-4);
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .c-widget {
    width: 170px;
    height: 170px;
  }
}
</style>
