<template>
  <div :class="['c-avatar', { workspace: isWorkspaceAvatar === true }]">
    <img v-if="user && user.avatar" class="c-avatar" :src="`${assetPath}/${user.avatar}`" />
    <span v-if="svg" v-html="svg"> </span>
  </div>
</template>

<script>
import { createAvatar } from "@dicebear/core";
import * as thumbs from "@dicebear/thumbs";
import * as glass from "@dicebear/glass";

export default {
  props: {
    user: {},
    workspace: {}
  },

  data: function () {
    return {
      svg: null
    };
  },

  watch: {
    workspace: function () {
      this.createAvatar();
    }
  },

  computed: {
    baseApiUrl: function () {
      return this.$store.app.baseApiUrl;
    },
    assetPath: function () {
      let baseUrl = this.baseApiUrl;
      return `${baseUrl}/uploads`;
    },
    isWorkspaceAvatar: function () {
      // avatar is already present, no need for svg
      if (this.user && this.user.avatar) {
        return false;
      }

      if (this.user && this.user.email) {
        return false;
      }

      if (this.workspace && this.workspace.name) {
        return true;
      }

      return false;
    }
  },

  methods: {
    createAvatar: function () {
      // only create avatar is needed
      let seed = null;

      // avatar is already present, no need for svg
      if (this.user && this.user.avatar) {
        return;
      }

      let type = thumbs;

      if (this.user && this.user.email) {
        seed = this.user.email;
      }

      if (this.workspace && this.workspace.name) {
        seed = this.workspace.name;
        type = glass;
      }

      if (!seed) {
        return;
      }

      this.createSvg(seed, type);
    },
    createSvg: function (seed, type) {
      let temp = createAvatar(type, {
        seed: seed
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

  &.workspace {
    border-radius: 0.5rem;
  }
}
</style>
