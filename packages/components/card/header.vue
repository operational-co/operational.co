<template>
  <div
    :class="['c-card-header', { expandable: expandable === true }, { context: type === 'context' }]"
    @click.prevent="onClick"
  >
    <span v-if="debug" class="c-card-header__debug">
      {{ item.id }}
    </span>
    <div class="c-card-header__image">
      <img v-if="item.avatar && isUrl(item.avatar)" :src="item.avatar" />
      <template v-else>{{ item.avatar || `~` }}</template>
    </div>
    <div class="c-card-header__title">
      <span>
        {{ date }}
      </span>
      <div class="div">&nbsp;•&nbsp;</div>
      <span>
        {{ item.name }}
      </span>
      <!-- <template v-if="item.notify">
        <span class="div">&nbsp;•&nbsp;</span>
        <span title="This event had a notification">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2.00004C8.06401 2.00004 4.73599 4.91377 4.21579 8.81524L3.00878 17.8679C2.97068 18.1536 3.05773 18.4419 3.24762 18.6588C3.4375 18.8756 3.71174 19 4 19H7.35364C8.25779 20.7479 9.96137 22 12 22C14.0386 22 15.7422 20.7479 16.6464 19H20C20.2883 19 20.5625 18.8756 20.7524 18.6588C20.9423 18.4419 21.0293 18.1536 20.9912 17.8679L19.7842 8.81524C19.264 4.91377 15.936 2.00004 12 2.00004ZM14.2218 19H9.77824C10.3872 19.6373 11.1768 20 12 20C12.8232 20 13.6128 19.6373 14.2218 19Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.60192 1.98256C5.0247 2.33791 5.07936 2.96871 4.72401 3.39149C3.75212 4.54779 3.05168 5.93763 2.71857 7.46366C2.60079 8.00324 2.06789 8.34517 1.52831 8.22739C0.98873 8.10961 0.646797 7.57671 0.76458 7.03713C1.16861 5.1862 2.01784 3.50277 3.19299 2.10465C3.54834 1.68187 4.17914 1.62721 4.60192 1.98256ZM19.3981 1.98256C19.8209 1.62721 20.4517 1.68187 20.807 2.10465C21.9822 3.50278 22.8314 5.1862 23.2355 7.03713C23.3532 7.57671 23.0113 8.10961 22.4717 8.22739C21.9321 8.34517 21.3993 8.00324 21.2815 7.46366C20.9484 5.93763 20.2479 4.54779 19.276 3.39149C18.9207 2.96871 18.9753 2.33791 19.3981 1.98256Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </template>
      <template v-if="item.category">
        <span class="div">&nbsp;•&nbsp;</span>
        <span>
          {{ item.category }}
        </span>
      </template> -->
    </div>
    <!-- <div class="c-card-header__labels">
      <span v-if="item.notify"> N </span>
      <span v-if="item.contexts && item.contexts.length"> C </span>
      <span v-if="item.actions && item.actions.length"> A </span>
    </div> -->
    <div class="c-card-header__expand">
      <template v-if="expandable">
        <svg v-if="!expand" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10V6.41421L14.7071 10.7071C14.3166 11.0976 13.6834 11.0976 13.2929 10.7071C12.9024 10.3166 12.9024 9.68342 13.2929 9.29289L17.5858 5H14C13.4477 5 13 4.55228 13 4ZM4 13C4.55228 13 5 13.4477 5 14V17.5858L9.29289 13.2929C9.68342 12.9024 10.3166 12.9024 10.7071 13.2929C11.0976 13.6834 11.0976 14.3166 10.7071 14.7071L6.41421 19H10C10.5523 19 11 19.4477 11 20C11 20.5523 10.5523 21 10 21H4C3.44772 21 3 20.5523 3 20V14C3 13.4477 3.44772 13 4 13Z"
            fill="currentColor"
          />
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.9571 3.04289C21.3476 3.43342 21.3476 4.06658 20.9571 4.45711L16.4142 9H20C20.5523 9 21 9.44772 21 10C21 10.5523 20.5523 11 20 11H14C13.4477 11 13 10.5523 13 10V4C13 3.44772 13.4477 3 14 3C14.5523 3 15 3.44772 15 4V7.58579L19.5429 3.04289C19.9334 2.65237 20.5666 2.65237 20.9571 3.04289ZM3 14C3 13.4477 3.44772 13 4 13H10C10.5523 13 11 13.4477 11 14V20C11 20.5523 10.5523 21 10 21C9.44772 21 9 20.5523 9 20V16.4142L4.45711 20.9571C4.06658 21.3476 3.43342 21.3476 3.04289 20.9571C2.65237 20.5666 2.65237 19.9334 3.04289 19.5429L7.58579 15H4C3.44772 15 3 14.5523 3 14Z"
            fill="currentColor"
          />
        </svg>
      </template>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import utils from "@operational.co/lib/utils.js";

export default {
  props: {
    item: {},
    type: {
      type: String,
      default: ""
    },
    expandable: {},
    expand: {},
    debug: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    date: function () {
      let item = this.item;

      if (!item.createdAt) {
        return "no-date";
      }

      return utils.dateTime(item.createdAt);

      return moment(item.createdAt).format("hh:mm a");
    }
  },

  methods: {
    onClick: function () {
      this.$emit("onToggleExpand");
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
.c-card-header {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: var(--margin-lg);
  padding: var(--margin-lg);
  user-select: none;

  &.expandable {
    cursor: pointer;
  }

  &__debug {
    position: absolute;
    top: 2px;
    left: 2px;
    font-family: var(--font-family-monospace);
    font-size: var(--font-size-xs);
    opacity: 0.8;
    line-height: 1;
  }

  &__image {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: var(--color-bg-1);
    font-size: var(--font-size-lg);
    font-weight: 500;
    overflow: hidden;
    user-select: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }

  // &__labels {
  //   display: inline-flex;
  //   align-items: center;
  //   justify-content: space-between;

  //   span {
  //     display: inline-flex;
  //     width: 24px;
  //     height: 24px;
  //     margin-right: 4px;
  //     justify-content: center;
  //     align-items: center;
  //     font-size: var(--font-size-xs);
  //     //font-family: var(--font-family-monospace);
  //     font-weight: 500;
  //     line-height: 1;
  //     background-color: rgba(0, 0, 0, 0.15);
  //     color: rgba(255, 255, 255, 0.65);
  //     border-radius: 8px;

  //     &:last-child {
  //       margin-right: 0;
  //     }
  //   }
  // }

  &__expand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    font-size: var(--font-size-lg);
    font-weight: 500;
    overflow: hidden;
    user-select: none;
    cursor: pointer;

    opacity: 0.25;

    transition: all var(--transition-time) ease-out;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    //flex-direction: column;
    font-weight: 400;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .div {
      display: inline-block;
      margin: 0;
      width: 16px;
      text-align: center;
      opacity: 0.65;
    }

    span {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;

      &:first-child {
        min-width: 64px;
        overflow: initial;
        text-overflow: initial;
        opacity: 0.65;
      }
    }
  }

  &.context {
    font-size: var(--font-size-sm);
    padding: 4px;
    margin-left: -4px;
    grid-column-gap: var(--margin);
    align-items: center;

    .c-card-header__image {
      width: 24px;
      height: 24px;
      font-size: var(--font-size-sm);
    }
    .c-card-header__title {
      line-height: 1.5rem;
      > span {
        letter-spacing: -0.25px;

        &:first-child {
          min-width: 60px;
          opacity: 0.65;
        }
      }
    }
  }

  &:hover,
  &:active {
    .c-card-header__expand {
      opacity: 1;
    }
  }

  @media screen and (max-width: 940px) {
    grid-template-columns: max-content 1fr max-content;
    grid-column-gap: 8px;
    font-size: var(--font-size-sm);
    padding: 6px;

    // &__labels {
    //   display: none;
    //   span {
    //     margin-right: 0;
    //     border-radius: 0;
    //     border-right: var(--color-bg-2) solid 1px;

    //     &:first-child {
    //       border-top-left-radius: 8px;
    //       border-bottom-left-radius: 8px;
    //     }

    //     &:last-child {
    //       border-top-right-radius: 8px;
    //       border-bottom-right-radius: 8px;

    //       border-right: none;
    //     }
    //   }
    // }

    &__title {
      line-height: 1.1;
      .div {
        width: 14px;
      }

      span {
        &:first-child {
          min-width: 60px;
        }
      }

      > p {
        font-size: var(--font-size-sm);
      }
    }

    &__image {
      width: 32px;
      height: 32px;
      font-size: var(--font-size);
    }

    &.context {
      grid-column-gap: 8px;
    }
  }
}
</style>
