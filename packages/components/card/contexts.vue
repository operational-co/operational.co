<template>
  <div class="c-card-contexts">
    <template v-if="active">
      <div class="c-card-contexts__item" v-for="(item, i) in computedItems" :key="i">
        <Header :item="item" type="context"></Header>
        <div class="c-card-contexts__item__body" v-if="showBody(item)">
          <Resolve :payload="item"></Resolve>
        </div>
      </div>
      <div class="c-card-contexts__footer">{{ item.contexts.length + 1 }} events. {{ diff }}.</div>
    </template>
    <!-- <div :class="['c-card-contexts__collapse', { active: active === true }]" @click="toggle">
      <span> {{ contextText }} contexts </span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 9L12 17L4 9"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div> -->
  </div>
</template>

<script>
import moment from "moment";
import Resolve from "./resolve.vue";
import utils from "@operational.co/lib/utils.js";
import Header from "./header.vue";

export default {
  components: {
    Resolve,
    Header
  },

  data: function () {
    return {
      active: true
    };
  },

  props: {
    item: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },

  computed: {
    contextText: function () {
      if (this.active) {
        return `Hide`;
      }
      return `Show`;
    },
    diff: function () {
      let item = this.item;

      let date1 = item.createdAt;

      if (item.contexts.length === 0) {
        return ``;
      }

      let date2 = item.contexts[item.contexts.length - 1].createdAt;

      let obj = utils.dateDifference(date1, date2);

      let str = `${obj.diff} ${obj.format}`;

      return str;
    },
    items: function () {
      return this.$store.events.resources;
    },
    computedItems: function () {
      let contexts = this.item.contexts || [];

      for (let i = 0; i < contexts.length; i++) {
        let c = contexts[i];
        if (!c.avatar) {
          c.avatar = this.item.avatar;
        }
        contexts[i] = c;
      }

      return contexts;
    }
  },

  methods: {
    showBody: function (item) {
      if (item.actions && Object.keys(item.actions).length !== 0) {
        return true;
      }

      if (item.type !== "text" && item.content) {
        let json = null;
        try {
          json = JSON.parse(item.content);
        } catch (err) {}
        if (item.type === "rows" && json) {
          return true;
        } else {
          return false;
        }
      }

      if (item.contexts && item.contexts.length > 0) {
        return true;
      }

      return false;
    },
    toggle: function () {
      this.active = !this.active;
    },
    date: function (createdAt) {
      if (!createdAt) {
        return "no-date";
      }

      return moment(createdAt).format("hh:mm a");
    },
    isUrl: function (url) {
      try {
        url = new URL(url);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    }
  }
};
</script>

<style lang="scss">
.c-card-contexts {
  //padding-top: var(--margin-lg);

  &__collapse {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    > span {
      display: inline-block;
    }

    > svg {
      margin-left: var(--margin);
      transform: rotate(0deg);
    }

    &.active {
      > svg {
        transform: rotate(180deg);
      }
    }

    &:hover,
    &:active {
      background-color: var(--color-bg-4);
    }
  }

  &__footer {
    opacity: 0.75;
    padding-top: var(--margin);
    font-size: var(--font-size-sm);
  }

  &__item {
    position: relative;
    &__body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: var(--margin);
      padding-left: calc(var(--margin-lg) + 20px);
      padding-top: 0;
      font-size: var(--font-size-sm);

      > a {
        display: block;
      }

      > strong {
        display: block;
        font-weight: 500;
        line-height: 1rem;
      }
    }

    &:after {
      content: "";
      position: absolute;
      bottom: -1.5px;
      left: 11px;
      width: 0;
      height: calc(100% - 29px);
      //background-color: var(--color-bg-5);
      border-left: dashed 2px var(--color-bg-5);
      //border-radius: 4px;
    }
  }

  @media screen and (max-width: 576px) {
    margin-left: calc(var(--margin-lg) * -1 + 38px * -1);
    width: calc(100% + var(--margin-lg) + 38px);
    padding-left: 15px;

    &__item {
      padding-left: 2px;

      &:after {
        left: 13px;
      }
    }
  }
}
</style>
