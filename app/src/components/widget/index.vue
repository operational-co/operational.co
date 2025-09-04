<template>
  <div :class="['c-widget', { moving: moving === true }]">
    <div class="c-widget__wrap">
      <div class="c-widget__popup">
        <a class="c-widget__handle">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3C7.89543 3 7 3.89543 7 5C7 6.10457 7.89543 7 9 7C10.1046 7 11 6.10457 11 5C11 3.89543 10.1046 3 9 3Z"
              fill="currentColor"
            />
            <path
              d="M15 3C13.8954 3 13 3.89543 13 5C13 6.10457 13.8954 7 15 7C16.1046 7 17 6.10457 17 5C17 3.89543 16.1046 3 15 3Z"
              fill="currentColor"
            />
            <path
              d="M9 10C7.89543 10 7 10.8954 7 12C7 13.1046 7.89543 14 9 14C10.1046 14 11 13.1046 11 12C11 10.8954 10.1046 10 9 10Z"
              fill="currentColor"
            />
            <path
              d="M15 10C13.8954 10 13 10.8954 13 12C13 13.1046 13.8954 14 15 14C16.1046 14 17 13.1046 17 12C17 10.8954 16.1046 10 15 10Z"
              fill="currentColor"
            />
            <path
              d="M9 17C7.89543 17 7 17.8954 7 19C7 20.1046 7.89543 21 9 21C10.1046 21 11 20.1046 11 19C11 17.8954 10.1046 17 9 17Z"
              fill="currentColor"
            />
            <path
              d="M15 17C13.8954 17 13 17.8954 13 19C13 20.1046 13.8954 21 15 21C16.1046 21 17 20.1046 17 19C17 17.8954 16.1046 17 15 17Z"
              fill="currentColor"
            />
          </svg>
          <span> Move </span>
        </a>
        <a href="#">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.6447 5.54878L6.90046 5.14626C6.57358 5.07083 6.23089 5.16911 5.99368 5.40632L5.40632 5.99368C5.16911 6.23089 5.07083 6.57358 5.14626 6.90046L5.54878 8.6447C5.63978 9.03905 5.47717 9.44855 5.14043 9.67305L3.43326 10.8112C3.16258 10.9916 3 11.2954 3 11.6207V12.3793C3 12.7046 3.16259 13.0084 3.43326 13.1888L5.14043 14.327C5.47717 14.5514 5.63978 14.9609 5.54878 15.3553L5.14626 17.0995C5.07083 17.4264 5.16911 17.7691 5.40632 18.0063L5.99368 18.5937C6.23089 18.8309 6.57358 18.9292 6.90046 18.8537L8.6447 18.4512C9.03905 18.3602 9.44855 18.5228 9.67305 18.8596L10.8112 20.5667C10.9916 20.8374 11.2954 21 11.6207 21H12.3793C12.7046 21 13.0084 20.8374 13.1888 20.5667L14.327 18.8596C14.5514 18.5228 14.9609 18.3602 15.3553 18.4512L17.0995 18.8537C17.4264 18.9292 17.7691 18.8309 18.0063 18.5937L18.5937 18.0063C18.8309 17.7691 18.9292 17.4264 18.8537 17.0995L18.4512 15.3553C18.3602 14.9609 18.5228 14.5514 18.8596 14.327L20.5667 13.1888C20.8374 13.0084 21 12.7046 21 12.3793V11.6207C21 11.2954 20.8374 10.9916 20.5667 10.8112L18.8596 9.67305C18.5228 9.44855 18.3602 9.03905 18.4512 8.6447L18.8537 6.90046C18.9292 6.57358 18.8309 6.23089 18.5937 5.99368L18.0063 5.40632C17.7691 5.16911 17.4264 5.07083 17.0995 5.14626L15.3553 5.54878C14.9609 5.63978 14.5514 5.47717 14.327 5.14043L13.1888 3.43326C13.0084 3.16258 12.7046 3 12.3793 3H11.6207C11.2954 3 10.9916 3.16259 10.8112 3.43326L9.67305 5.14043C9.44855 5.47717 9.03905 5.63978 8.6447 5.54878Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          <!-- <span> Update </span> -->
        </a>
        <a href="#">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.93777 20.0665L6.93555 20L5.93777 20.0665ZM18.0622 20.0665L17.0644 20L18.0622 20.0665ZM3 5C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7V5ZM21 7C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5V7ZM11 11C11 10.4477 10.5523 10 10 10C9.44772 10 9 10.4477 9 11H11ZM9 16C9 16.5523 9.44772 17 10 17C10.5523 17 11 16.5523 11 16H9ZM15 11C15 10.4477 14.5523 10 14 10C13.4477 10 13 10.4477 13 11H15ZM13 16C13 16.5523 13.4477 17 14 17C14.5523 17 15 16.5523 15 16H13ZM14.9056 6.24926C15.0432 6.78411 15.5884 7.1061 16.1233 6.96844C16.6581 6.83078 16.9801 6.28559 16.8424 5.75074L14.9056 6.24926ZM4.00221 6.06652L4.93998 20.133L6.93555 20L5.99779 5.93348L4.00221 6.06652ZM6.93555 22H17.0644V20H6.93555V22ZM19.06 20.133L19.9978 6.06652L18.0022 5.93348L17.0644 20L19.06 20.133ZM19 5H5V7H19V5ZM3 7H5V5H3V7ZM19 7H21V5H19V7ZM17.0644 22C18.1174 22 18.99 21.1836 19.06 20.133L17.0644 20H17.0644V22ZM4.93998 20.133C5.01002 21.1836 5.88262 22 6.93555 22V20L4.93998 20.133ZM9 11V16H11V11H9ZM13 11V16H15V11H13ZM12 4C13.3965 4 14.5725 4.95512 14.9056 6.24926L16.8424 5.75074C16.2874 3.59442 14.3312 2 12 2V4ZM9.09447 6.24926C9.42756 4.95512 10.6035 4 12 4V2C9.66885 2 7.7126 3.59442 7.1576 5.75074L9.09447 6.24926Z"
              fill="currentColor"
            />
          </svg>

          <!-- <span> Remove </span> -->
        </a>
      </div>
      <Header v-if="widget && widget.type !== 'STAT'" :subtitle="subtitle"></Header>

      <div class="c-widget__inner" v-if="widget && widget.type !== 'STAT'">
        <Chart :data="data" :type="widget.type"></Chart>
      </div>

      <Stat v-if="widget && widget.type === 'STAT'" :widget="widget"></Stat>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/chart/index.vue";
import Header from "./header.vue";
import Stat from "./stat.vue";

import { toRaw } from "vue";

import moment from "moment";

export default {
  components: {
    Chart,
    Header,
    Stat,
  },

  props: {
    widget: {},
    moving: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    // normalize data here
    data: function () {
      if (this.widget.type === "STAT") {
        return;
      }
      let datas = toRaw(this.widget.data);

      datas = datas.filter((d) => {
        if (d.data) {
          return true;
        }
        return false;
      });

      datas = datas.map((d) => {
        d.data = d.data.map((datum) => {
          datum.x = moment(datum.x).format("MMM Do");
          datum.label = `${datum.y} user signups`;
          return datum;
        });
        let obj = {
          //color: "#777",
          data: d.data,
        };
        return obj;
      });

      return datas;
    },
    subtitle: function () {
      let widget = this.widget;

      if (!widget) {
        return;
      }

      return "nanana";

      let widgetCache = widget.widgetCache;

      if (!widgetCache[0]) {
        return "N/A";
      }

      let createdAt = widgetCache[0].createdAt;

      let date = this.formatDate(createdAt);

      return date;
    },
  },

  methods: {
    formatDate: function (isoDateString) {
      const date = new Date(isoDateString);
      const options = { month: "short" };
      const month = new Intl.DateTimeFormat("en-US", options).format(date);
      const day = date.getDate();
      const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

      return `${day}${suffix} ${month}`;
    },
  },

  mounted: function () {},
};
</script>

<style lang="scss">
.c-widget {
  height: 100%;
  background-color: var(--color-bg-2);
  border-radius: 8px;

  &__wrap {
    position: relative;
    height: 100%;
  }

  &__inner {
    padding: var(--margin-lg);
    padding-top: 0;
  }

  &__handle {
    cursor: grab;
  }

  &__popup {
    position: absolute;
    z-index: 9;
    background-color: var(--color-bg-3);
    box-shadow:
      lch(0 0 0 / 0.16) 0px 2px 6px -2px,
      lch(0 0 0 / 0.32) 0px 0px 1px;
    top: -16px;
    left: 50%;
    border-radius: 8px;
    transform: translateX(-50%);
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0;
    pointer-events: none;

    a {
      min-width: 32px;
      padding: 6px 4px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: var(--color-font);
      user-select: none;

      > svg {
        width: 20px;
        height: 20px;
        min-width: 20px;
      }

      > span {
        display: inline-block;
        padding-right: 0.5rem;
        margin-left: 4px;
        font-size: var(--font-size-xs);
        font-weight: 450;
        line-height: 1;
      }

      &:not(:last-child) {
        border-right: var(--color-bg-4) solid 1px;
      }

      &:hover,
      &:active {
        background-color: var(--color-bg-5);
      }
    }
  }

  @keyframes jiggle {
    0% {
      transform: rotate(-0.5deg);
    }
    25% {
      transform: rotate(0.5deg);
    }
    50% {
      transform: rotate(-0.5deg);
    }
    75% {
      transform: rotate(0.5deg);
    }
    100% {
      transform: rotate(-0.5deg);
    }
  }

  &.moving {
    //animation: jiggle 700ms infinite;
    //animation-timing-function: ease-in-out;
    backdrop-filter: blur(8px);

    .c-widget__popup {
      opacity: 1;
      pointer-events: initial;
    }
  }

  @media screen and (max-width: 576px) {
    //margin-top: var(--margin-lg);

    &__inner {
      padding: 0 var(--margin-lg);
      //padding: 0;
      //overflow-x: auto;

      min-height: 320px;
    }
  }
}
</style>
