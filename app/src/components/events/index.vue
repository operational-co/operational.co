<template>
  <div class="c-events">
    <div :class="['ptr', { active: pullActive === true }]">
      <span>Refreshing page...</span>
    </div>
    <Constrain size="xx">
      <section class="c-events__header">
        <h3>Events</h3>
        <Toggle :listening="listening" @onToggle="onToggle"></Toggle>
        <TestMode></TestMode>
      </section>
      <div class="c-events__inner">
        <Sidebar @onCategorySelected="onCategorySelected"></Sidebar>
        <main @click="onListClick">
          <Search
            ref="search"
            v-model:value="query"
            v-model:archive="showArchive"
            @onClear="onClear"
            @onCategorySelected="onCategorySelected"
          ></Search>
          <transition-group name="list" tag="div">
            <div
              :class="[
                'c-events__wrapper',
                { date: item && item.type === 'date' },
                { log: item && item.type !== 'date' },
              ]"
              :data-id="item.id"
              v-for="(item, i) in computedItems"
              :key="item.id"
            >
              <Item
                @onEventNameSearch="onEventNameSearch"
                v-if="item && item.type !== 'date'"
                :item="item"
                @onConfirmAction="onConfirmAction"
              >
              </Item>

              <div :class="['c-events__date']" v-if="item.type === 'date'">
                <span>
                  {{ item.content }}
                </span>
              </div>
            </div>
          </transition-group>
          <Bottom v-if="hasEnded && items.length > 0"></Bottom>
          <Empty
            :items="items"
            :loaded="loaded"
            :query="query"
            :category="category"
            :computedItems="computedItems"
            @onClear="onClear"
          ></Empty>
        </main>
      </div>
    </Constrain>
    <ModalConfirm
      :action="currentAction"
      @onConfirm="onConfirm"
      :active="modalConfirmActive"
      @onClose="modalConfirmActive = false"
    >
    </ModalConfirm>
    <ModalView :active="modalView" :eventId="modalView" :onClose="(modalView = false)"></ModalView>
  </div>
</template>

<script>
import moment from "moment";
import { nanoid } from "nanoid";

import Constrain from "@operational.co/components/ui/constrain.vue";
import Search from "@/components/search/index.vue";

import Bottom from "./bottom.vue";
import Item from "./item.vue";
import Empty from "./empty.vue";
import Toggle from "./toggle.vue";
import ModalView from "./modal-view.vue";
import ModalConfirm from "./modal-confirm.vue";
import TestMode from "./test-mode.vue";
import Sidebar from "./sidebar.vue";

export default {
  components: {
    Constrain,
    Bottom,
    Item,
    Search,
    Empty,
    Toggle,
    ModalView,
    ModalConfirm,
    TestMode,
    Sidebar,
  },

  data: function () {
    return {
      showArchive: false,
      query: "",
      category: "",
      lock: false,
      currentAction: null,
      hasEnded: false,

      modalView: false,
      modalConfirmActive: false,

      touchstartY: 0,
      pullActive: false,

      lastRefresh: null,
      scrollThreshold: 600,

      loaded: false,

      listening: true,

      intervalId: null,
      listeningInterval: 4000,
    };
  },

  watch: {
    lock: function () {},
    query: function () {
      this.processQuery();
    },
    showArchive: function () {
      this.processQuery();
    },
    testMode: function () {
      this.onClear();
    },
  },

  computed: {
    testMode: function () {
      return this.$store.app.testMode;
    },
    items: function () {
      let items = this.$store.events.resources;

      return items;
    },
    computedItems: function () {
      let items = this.items;

      let newItems = [];

      let currentWeek = null;
      let currentDay = null;
      let format = `ddd Do MMM`; //`ddd Do MMM hh:mm a`;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        //--- week resolution

        let week = moment(item.createdAt).week();
        let day = moment(item.createdAt).dayOfYear();

        if (currentDay !== day) {
          currentDay = day;

          let startDate = moment(item.createdAt).subtract(1, "days").format(format);

          let endDate = moment(item.createdAt).format(format);

          let str = `Events on ${endDate}`; //`${startDate} → ${endDate}`;

          newItems.push({
            type: "date",
            content: str,
            id: str, //nanoid(),
          });
        }

        let obj = {
          type: "log",
          ...item,
        };

        if (obj.content && typeof obj.content === "string" && obj.type === "rows") {
          obj.content = JSON.parse(obj.content);
        }

        if (obj.actions && obj.actions.length) {
          for (let j = 0; j < obj.actions.length; j++) {
            let action = obj.actions[j];

            if (typeof action === "string") {
              try {
                action = JSON.parse(action);
              } catch (err) {
                action = {
                  _error: true,
                };
              }
            }

            obj.actions[j] = action;
          }
        }

        newItems.push(obj);
      }

      return newItems;
    },
  },

  methods: {
    onListClick: function () {
      if (this.listening) {
        this.listening = false;
      }
    },
    onToggle: function (condition) {
      if (condition) {
        this.listening = true;
      } else {
        this.listening = !this.listening;
      }
    },
    onCategorySelected: function (e) {
      console.log(e);
      this.category = e;
      this.processQuery();
    },
    onEventNameSearch: function (name) {
      this.$store.app.sendNotification(`Searching for "${name}"`);
      this.$refs.search.setValue(name);
    },
    processQuery: function () {
      console.log("processing query");
      let params = {};
      params.query = this.query;
      params = {
        ...params,
        muted: this.showArchive,
        cursor: -1, // Remove cursor(expect search has been refreshed)
        category: this.category,
      };

      this.hasEnded = false; // Expect search has been refreshed

      //params.mentions = [22543];
      this.$store.app.setLoading(true);
      this.$store.events.setParams(params, true).then(() => {
        this.$store.app.setLoading(false);
      });
    },
    onConfirmAction: function (e) {
      this.currentAction = e;
      this.modalConfirmActive = true;
    },
    onRefresh: function () {
      this.onClearButKeepSearchAndCategory();
    },
    onConfirm: function (e) {
      this.modalConfirmActive = false;
    },
    onClear: function () {
      this.query = "";
      this.category = "";

      const params = {
        muted: this.showArchive,
        mentions: [],
        cursor: -1,
        query: this.query,
        category: this.category,
      };
      this.hasEnded = false; // Expect search has been refreshed
      this.$store.app.setLoading(true);
      this.$store.events.clear();
      this.$store.events.setParams(params, true).then(() => {
        this.$store.app.setLoading(false);
      });
    },
    onClearButKeepSearchAndCategory: function () {
      const params = {
        muted: this.showArchive,
        mentions: [],
        cursor: -1,
        query: this.query,
        category: this.category,
      };
      this.hasEnded = false; // Expect search has been refreshed
      this.$store.app.setLoading(true);
      this.$store.events.clear();
      this.$store.events.setParams(params, true).then(() => {
        this.$store.app.setLoading(false);
      });
    },
    async loadInit() {
      const params = {
        query: this.query,
        muted: this.showArchive,
        category: this.category,
      };

      this.lock = true;
      this.$store.app.setLoading(true);
      const newEvents = await this.$store.events.setParams(params);
      this.$store.app.setLoading(false);
      this.loaded = true;
      this.lock = false;

      if ((newEvents && newEvents.length === 0) || !newEvents) {
        this.hasEnded = true;
      }

      // now check for eventId param
      this.checkEventId();
    },
    checkEventId: function () {
      let url = new URL(window.location.href);

      if (!url.searchParams) {
        return;
      }

      let eventId = null;

      url.searchParams.forEach((value, key) => {
        if (key === "eventId" && value) {
          eventId = value;
        }
      });

      url.searchParams.delete("eventId"); // Remove the query parameter
      window.history.replaceState({}, "", url);

      if (!eventId) {
        return;
      }

      let event = null;

      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];

        if (item.id === eventId) {
          event = item;
        }
      }

      if (!event) {
        this.modalView = eventId;
        // open modal instead
        return;
      }

      this.scrollToEvent(event);
    },
    async onBottomReached() {
      if (this.lock) {
        return;
      }
      let lastItem = null;
      if (this.items && this.items.length) {
        lastItem = this.items[this.items.length - 1];
      }
      this.lock = true;

      if (!lastItem) {
        this.loaded = true;
        return;
      }

      const params = {
        query: this.query,
        //skip: this.$store.events.take + this.$store.events.skip,
        muted: this.showArchive,
        cursor: lastItem.id,
        category: this.category,
      };

      this.$store.app.setLoading(true);
      // final check to see that no events are pending
      const newEvents = await this.$store.events.setParams(params);

      this.$store.app.setLoading(false);

      if ((newEvents && newEvents.length === 0) || !newEvents) {
        this.hasEnded = true;
      }

      this.loaded = true;
      // run lock false later because some processing time is involved in rendering new events on screen
      await new Promise((r) => setTimeout(r, 100));
      this.lock = false;
    },
    scrollToEvent: function (event) {
      const dataId = event.id;
      const element = document.querySelector(`[data-id="${dataId}"]`);
      const container = document.querySelector(".c-app__body");

      if (!element) {
        return;
      }

      setTimeout(() => {
        container.scrollTo({
          top: element.offsetTop - 56,
          behaviour: "smooth",
        });

        element.classList.add("flash-highlight");

        setTimeout(() => {
          element.classList.remove("flash-highlight");
        }, 1500);
      }, 200);
    },
    handleScroll() {
      if (this.hasEnded) {
        return;
      }

      const bodyEl = document.querySelector(".c-app__body");
      const height = bodyEl.offsetHeight;

      const innerEl = document.querySelector(".c-app__body > div");
      const currentScrollPosition = bodyEl.scrollTop + height;

      // All results have been fetched, don't do this query again

      // then figure out onBottomReached
      const scrollableHeight = innerEl.offsetHeight;
      const threshold = this.scrollThreshold; // Adjust as needed

      const condition = currentScrollPosition + threshold >= scrollableHeight;

      if (condition) {
        this.onBottomReached();
      }
    },
    onTouchStart(e) {
      this.touchstartY = e.touches[0].clientY;
    },
    onTouchMove(e) {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - this.touchstartY;
      //console.log(touchDiff, window.screenY);
      let diff = 200;
      if (touchDiff > diff && window.scrollY <= 0) {
        //console.log(`touchmove ${touchDiff} ${window.screenY} - pullactive`);
        this.pullActive = true;
        e.preventDefault();
      } else {
        //console.log(`touchmove ${touchDiff} ${window.scrollY}`);
      }
    },
    onTouchEnd(e) {
      if (this.pullActive) {
        //console.log("touchend");
        this.onRefresh();
        this.pullActive = false;
        //location.reload();
      }
    },
    onVisibilityChange: function () {
      if (document.visibilityState === "visible" && this.lastRefresh) {
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate - this.lastRefresh;

        const differenceInSeconds = differenceInMilliseconds / 1000;

        // Don't reload if query is already set
        if (this.query) {
          return;
        }

        // if more than 1 minute
        if (differenceInSeconds > 60) {
          this.onRefresh();
          this.lastRefresh = new Date();
        }
      }
    },

    addEventListeners: function () {
      document.querySelector(".c-app__body").addEventListener("scroll", this.handleScroll);

      // window.document.addEventListener(
      // 	"visibilitychange",
      // 	this.onVisibilityChange,
      // );

      document.addEventListener("touchstart", this.onTouchStart);
      document.addEventListener("touchmove", this.onTouchMove);
      document.addEventListener("touchend", this.onTouchEnd);
    },
    removeEventListeners: function () {
      document.querySelector(".c-app__body").removeEventListener("scroll", this.handleScroll);

      // window.document.removeEventListener(
      // 	"visibilitychange",
      // 	this.onVisibilityChange,
      // );

      document.removeEventListener("touchstart", this.onTouchStart);
      document.removeEventListener("touchmove", this.onTouchMove);
      document.removeEventListener("touchend", this.onTouchEnd);
    },
    startInterval() {
      this.intervalId = setInterval(() => {
        if (!this.listening) {
        } else {
          this.$store.events.getLatest();
        }
      }, this.listeningInterval);
    },
    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
  },

  async mounted() {
    this.loaded = false;
    this.lastRefresh = new Date();

    await this.loadInit();

    this.addEventListeners();

    this.startInterval();
  },

  beforeUnmount() {
    this.removeEventListeners();

    this.stopInterval();

    this.$store.events.reset();
  },
};
</script>

<style lang="scss">
.c-events {
  position: relative;
  .ptr {
    position: fixed;
    z-index: 4;
    top: -37px;
    width: 100%;
    height: 40px;
    //display: flex;
    justify-content: center;
    align-items: center;
    transition: all var(--transition-time-sm) ease-in-out;
    font-size: var(--font-size-sm);
    opacity: 0.8;
    display: none;

    span {
      display: inline-block;
      background-color: hsl(var(--hue-p), 50%, 45%);
      padding: 0.25rem 1rem;
      border-radius: var(--border-radius);
      box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.2);
    }

    &.active {
      //background-color: var(--color-bg-4);
      top: 20px;
      opacity: 1;
    }
  }

  /* The overall transition for entering and leaving */
  .list-enter-active,
  .list-leave-active {
    transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Starting (enter-from) and ending (leave-to) states */
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(4px);
  }

  /* This class is automatically applied by transition-group 
   when items are moving to new positions. */
  .list-move {
    transition: transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .c-constrain {
    &__inner {
      position: relative;

      main {
        min-width: 0;
        overflow: hidden;
      }
    }
  }

  &__wrapper {
    &.date {
      padding-top: 0;
      position: sticky;
      z-index: 1;
      top: 0;
      padding-bottom: var(--margin);
    }

    &.log {
      padding-bottom: var(--margin);
    }

    &.flash-highlight {
      .c-card {
        animation: flash-bg 1.5s ease-in-out;
      }
    }
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;

    h3 {
      margin-bottom: 0;
    }

    > a {
      margin-left: auto;
      font-weight: 500;
      font-family: var(--font-family-monospace);
      font-size: var(--font-size-sm);
    }
  }

  &__inner {
    display: grid;
    grid-template-columns: 240px 1fr;
  }

  &__date {
    position: relative;
    font-size: var(--font-size-sm);
    display: block;
    padding: var(--margin);
    padding-left: 0;
    background-color: var(--color-bg-1);

    > span {
      position: relative;
      z-index: 1;
    }

    &:after {
      content: "";
      position: absolute;
      top: calc(50% - 2px);
      left: 10px;
      width: calc(100% - 20px);
      height: 4px;
      background-color: var(--color-bg-1);
      border-radius: var(--border-radius);
    }
  }

  @media screen and (max-width: 940px) {
    //padding-top: var(--margin-lg);

    &__wrapper {
      &.date {
        padding-bottom: var(--margin-sm);
      }
      &.log {
        padding-bottom: var(--margin-sm);
      }
    }

    .ptr {
      display: flex;
    }
    &__date {
      font-size: var(--font-size-xs);
      > span {
        padding: var(--margin);
      }
      &:after {
        display: none;
      }
    }

    &__header {
      > svg {
        display: none;
      }
    }
  }

  @media screen and (max-width: 780px) {
    &__inner {
      display: block;
    }

    .c-events-sidebar {
      display: none;
    }
  }
}
</style>
