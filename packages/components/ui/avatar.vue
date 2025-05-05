<template>
  <div class="c-avatar">
    <img v-if="user && user.avatar" class="c-avatar" :src="`${assetPath}/${user.avatar}`" />
    <span v-if="!user && svg" v-html="svg"> </span>
  </div>
</template>

<script>
import { createAvatar } from "@dicebear/core";
//import { thumbs } from "@dicebear/collection";
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
      let temp = createAvatar(thumbs, {
        seed: this.name || ""
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
