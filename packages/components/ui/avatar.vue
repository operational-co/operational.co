<template>
  <div class="c-avatar">
    <img v-if="user && user.avatar" class="c-avatar" :src="`${assetPath}/${user.avatar}`" />
    <span v-if="svg" v-html="svg"> </span>
  </div>
</template>

<script>
import { createAvatar } from "@dicebear/core";
import * as thumbs from "@dicebear/thumbs";

export default {
  props: {
    user: {}
  },

  data: function () {
    return {
      svg: null
    };
  },

  computed: {
    baseApiUrl: function () {
      return this.$store.app.baseApiUrl;
    },
    assetPath: function () {
      let baseUrl = this.baseApiUrl;
      return `${baseUrl}/uploads`;
    }
  },

  methods: {
    createAvatar: function () {
      // only create avatar is needed
      if (this.user && this.user.avatar) {
        return;
      }
      let temp = createAvatar(thumbs, {
        seed: this.user.email || ""
      });

      let svg = temp.toString();

      this.svg = svg;
    }
  },

  mounted: function () {
    this.createAvatar();
  }
};
</script>

<style lang="scss">
.c-avatar {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 99px;
  overflow: hidden;
}
</style>
