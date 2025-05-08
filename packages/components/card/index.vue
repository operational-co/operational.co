<template>
  <div :class="['c-card', { context: item.contexts && item.contexts.length > 0 }, { expand: showBody === true }]">
    <Header :expand="expand" :expandable="expandable" @onToggleExpand="onToggleExpand" :item="item"></Header>
    <div class="c-card__body">
      <Resolve :payload="item" v-if="item.content"></Resolve>
      <div class="c-card__spacer" v-if="item.content && item.actions"></div>
      <Actions
        :createdAt="item.createdAt"
        @onConfirmAction="onConfirmAction"
        v-if="item.actions"
        :actions="item.actions"
      ></Actions>
      <div
        class="c-card__spacer"
        v-if="(item.actions || item.content) && item.contexts && item.contexts.length > 0"
      ></div>
      <Contexts
        v-if="item.contexts && item.contexts.length > 0"
        :item="item"
        @onConfirmAction="onConfirmAction"
      ></Contexts>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Header from "./header.vue";
import Resolve from "./resolve.vue";
import Actions from "@operational.co/components/actions/index.vue";
import Contexts from "./contexts.vue";

export default {
  components: {
    Resolve,
    Header,
    Actions,
    Contexts
  },

  props: {
    item: {
      type: Object,
      default: function () {
        return {};
      }
    },
    initialExpand: {
      type: Boolean,
      default: false
    }
  },

  data: function () {
    return {
      expand: false
    };
  },

  computed: {
    expandable: function () {
      if (this.item.actions && this.item.actions.length > 0) {
        return true;
      }

      if (this.item.content) {
        return true;
      }

      if (this.item.contexts && this.item.contexts.length > 0) {
        return true;
      }

      return false;
    },
    showBody: function () {
      if (this.expandable && this.expand) {
        return true;
      }

      return false;
    },
    date: function () {
      let item = this.item;

      if (!item.createdAt) {
        return "no-date";
      }

      return moment(item.createdAt).format("hh:mm a");
    }
  },

  methods: {
    onToggleExpand: function () {
      this.expand = !this.expand;
    },
    onEventNameSearch: function (name) {
      this.$emit("onEventNameSearch", name);
    },
    onConfirmAction: function (e) {
      this.$emit("onConfirmAction", e);
    },
    isUrl: function (url) {
      try {
        url = new URL(url);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    }
  },

  mounted: function () {
    if (this.initialExpand) {
      this.expand = true;
    }
  }
};
</script>

<style lang="scss">
.c-card {
  position: relative;
  border-radius: var(--border-radius);

  background-color: var(--color-bg-2);
  overflow: hidden;

  height: 58px;
  transition: height var(--transition-time) ease-in-out;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--color-bg-2);
  }

  &__spacer {
    padding: 2px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--margin-lg);
    padding-left: calc(var(--margin-lg) + 46px);
    padding-top: 0;
    margin-top: -2px; // Height saving measures

    > a {
      display: block;
    }

    > strong {
      display: block;
      font-weight: 500;
      line-height: 1rem;
    }
  }

  &.expand {
    height: max-content;
  }

  @media screen and (max-width: 940px) {
    height: 44px;

    &.expand {
      height: auto;
    }

    &__body {
      padding: 10px;
      padding-left: 48px;
      padding-top: 0;
    }

    &__spacer {
      padding: 1px;
    }
  }
}
</style>
