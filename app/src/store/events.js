import { defineStore } from "pinia";
import CrudStore from "@/lib/crud-store.js";
import http from "@/lib/http.js";
import { useAppStore } from "./app.js";

import { toRaw } from "vue";

const api = {
  contexts: async function (params = {}) {
    params = JSON.parse(JSON.stringify(params));
    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get("/events/contexts", options);

      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
  refresh: async function (params = {}) {
    params = JSON.parse(JSON.stringify(params));
    //console.log(params);
    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get("/events", options);
      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
  doAction: async function (action = {}, event) {
    const form = {
      action,
      event,
    };
    try {
      const res = await http.post(`/events/action`, form);

      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
  latest: async function (params = {}) {
    params = JSON.parse(JSON.stringify(params));

    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get("/events/latest", options);
      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
  sendEvent: async function (form, token) {
    form = JSON.parse(JSON.stringify(form));

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await http.post(
        "/api/v1/ingest",
        {
          ...form,
        },
        config,
      );
      return res;
    } catch (err) {
      throw err;
    }
  },
  findOne: async function (params = {}) {
    params = JSON.parse(JSON.stringify(params));

    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get(`/events/${params.id}`, options);
      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
  surrounding: async function (params = {}) {
    params = JSON.parse(JSON.stringify(params));
    const eventId = params.id;
    delete params.id;

    const options = {
      params: {
        ...params,
      },
    };

    try {
      const res = await http.get(`/events/${eventId}/surrounding`, options);
      return res.data || null;
    } catch (err) {
      throw err;
    }
  },
};

const mergeEvents = function (groups) {
  const items = [];
  const ids = {};

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i] || [];

    for (let j = 0; j < group.length; j++) {
      const item = group[j];

      if (!item || !item.id || ids[item.id]) {
        continue;
      }

      ids[item.id] = true;
      items.push(item);
    }
  }

  return items;
};

const config = {
  name: "events",
  isSingleton: false,
};

const eventsStore = new CrudStore(config, api);

export const eventsApi = api;

export const useEventsStore = defineStore(config.name, {
  state: function () {
    return {
      ...eventsStore.exportState(),

      skip: 0,
      take: 20,
      cursor: null,
      query: "",
      category: "",
      mentions: [],
      muted: false,

      latestLock: false,
      latestParamsVersion: 0,

      mode: "latest",
      anchorEventId: null,
      surroundingMuted: false,
      surroundingPageSize: 20,
      hasNewer: false,
      hasOlder: false,
      loadingNewer: false,
      loadingOlder: false,
      surroundingRequestVersion: 0,
      savedTimeline: null,
    };
  },
  getters: {
    ...eventsStore.exportGetters(),
  },
  actions: {
    ...eventsStore.exportActions(),

    sendEvent: async function (item, token) {
      try {
        const res = await api.sendEvent(item, token);

        return res;
      } catch (err) {
        throw err;
      }
    },

    reset: function () {
      this.latestParamsVersion += 1;
      this.surroundingRequestVersion += 1;

      const payload = {
        skip: 0,
        take: 20,
        cursor: null,
        query: "",
        category: "",
        mentions: [],
        muted: false,
      };
      this.state = {
        ...this.state,

        ...payload,
      };

      this.resources = [];
      this.mode = "latest";
      this.anchorEventId = null;
      this.surroundingMuted = false;
      this.hasNewer = false;
      this.hasOlder = false;
      this.loadingNewer = false;
      this.loadingOlder = false;
      this.savedTimeline = null;
    },

    clear: function () {
      this.resources = [];
    },

    setParams: async function (params, refresh = false) {
      this.latestParamsVersion += 1;

      if (typeof params.skip === "number") {
        this.skip = params.skip;
      }

      if (typeof params.query === "string") {
        this.query = params.query;
      }

      if (params.cursor) {
        this.cursor = params.cursor;
      }
      if (params.cursor === -1) {
        this.cursor = null;
      }

      if (params.mentions) {
        this.mentions = params.mentions;
      }

      if (params.category) {
        this.category = params.category;
      } else {
        this.category = "";
      }

      this.muted = params.muted || false;

      if (refresh) {
        return await this.refresh();
      } else {
        return await this.load();
      }
    },

    load: async function () {
      const params = {
        skip: this.skip,
        query: this.query,
        cursor: this.cursor,
        mentions: this.mentions,
        muted: this.muted,
        category: this.category,
      };

      const app = useAppStore();
      params.test = app.$state.testMode || false;

      let events = await api.refresh(params).catch((err) => {});

      if (events && events.length > 0) {
        this.resources.push(...events);

        return events;
      } else {
        return null;
      }
    },

    getLatest: async function () {
      if (this.mode === "surrounding") {
        return;
      }

      if (this.latestLock) {
        console.log("Denied because of lock");
        return;
      }

      let events = this.resources;

      events = toRaw(events);

      if (!events || !events.length) {
        return;
      }

      if (typeof this.query === "string" && this.query.trim().length > 0) {
        return;
      }

      this.latestLock = true;
      const latestParamsVersion = this.latestParamsVersion;

      try {
        let firstEvent = events[0];

        const cursor = firstEvent.id;

        const params = {
          cursor: cursor,
          category: this.category,
        };

        let newEvents = await api.latest(params).catch((err) => {});

        if (latestParamsVersion !== this.latestParamsVersion) {
          return;
        }

        if (typeof this.query === "string" && this.query.trim().length > 0) {
          return;
        }

        if (!newEvents) {
          newEvents = [];
        }

        newEvents = newEvents.reverse();

        if (newEvents.length > 0) {
          this.resources.unshift(...newEvents);
        }
      } finally {
        this.latestLock = false;
      }
    },

    refresh: async function () {
      const params = {
        skip: this.skip,
        query: this.query,
        category: this.category,
        cursor: this.cursor,
        mentions: this.mentions,
        muted: this.muted,
      };

      const app = useAppStore();
      params.test = app.$state.testMode || false;

      const events = await api.refresh(params).catch((err) => {});

      this.resources = events || [];

      //this.loadContexts();

      return events;
    },

    loadContexts: async function () {
      let events = this.resources;

      let contextIds = [];

      for (let i = 0; i < events.length; i++) {
        let event = events[i];

        if (event.contextId) {
          contextIds.push(event.contextId);
        }
      }

      let params = {
        contexts: contextIds,
      };

      let contextualEvents = await api.contexts(params);

      for (let i = 0; i < events.length; i++) {
        let event = events[i];

        if (event.contextType === 0) {
          continue;
        }

        if (event.contextType === 2) {
          continue;
        }

        if (event.contexts && event.contexts.length > 0) {
          continue;
        }

        event.contexts = [];

        for (let j = 0; j < contextualEvents.length; j++) {
          if (event.contextId === contextualEvents[j].contextId) {
            event.contexts.push(contextualEvents[j]);
          }
        }

        //events[i] = event;
      }
    },

    findOne: async function (params = {}) {
      const event = await api.findOne(params).catch((err) => {});

      return event;
    },

    showSurrounding: async function (eventId, scrollTop = 0) {
      if (!eventId) {
        return null;
      }

      if (this.mode !== "surrounding") {
        this.savedTimeline = {
          resources: this.resources.slice(),
          skip: this.skip,
          take: this.take,
          cursor: this.cursor,
          query: this.query,
          category: this.category,
          mentions: this.mentions.slice(),
          muted: this.muted,
          scrollTop,
        };
      }

      this.latestParamsVersion += 1;
      this.surroundingRequestVersion += 1;

      const requestVersion = this.surroundingRequestVersion;
      this.mode = "surrounding";
      this.anchorEventId = eventId;
      this.hasNewer = false;
      this.hasOlder = false;
      this.loadingNewer = false;
      this.loadingOlder = false;

      const result = await api
        .surrounding({
          id: eventId,
          take: this.surroundingPageSize,
        })
        .catch((err) => null);

      if (requestVersion !== this.surroundingRequestVersion) {
        return null;
      }

      if (!result || !result.anchor) {
        this.leaveSurrounding();
        return false;
      }

      this.anchorEventId = result.anchor.id;
      this.surroundingMuted = !!result.anchor.muted;
      this.hasNewer = !!result.hasNewer;
      this.hasOlder = !!result.hasOlder;
      this.resources = mergeEvents([
        result.newer,
        [result.anchor],
        result.older,
      ]);

      return result;
    },

    loadSurroundingNewer: async function () {
      if (
        this.mode !== "surrounding" ||
        this.loadingNewer ||
        !this.hasNewer ||
        !this.resources.length
      ) {
        return [];
      }

      this.loadingNewer = true;
      const requestVersion = this.surroundingRequestVersion;
      const firstEvent = this.resources[0];

      try {
        let events = await api
          .latest({
            cursor: firstEvent.id,
            muted: this.surroundingMuted,
          })
          .catch((err) => null);

        if (
          requestVersion !== this.surroundingRequestVersion ||
          this.mode !== "surrounding"
        ) {
          return [];
        }

        if (!events) {
          return [];
        }

        this.hasNewer = events.length > this.surroundingPageSize;
        events = events.slice(0, this.surroundingPageSize).reverse();
        this.resources = mergeEvents([events, this.resources]);

        return events;
      } finally {
        if (requestVersion === this.surroundingRequestVersion) {
          this.loadingNewer = false;
        }
      }
    },

    loadSurroundingOlder: async function () {
      if (
        this.mode !== "surrounding" ||
        this.loadingOlder ||
        !this.hasOlder ||
        !this.resources.length
      ) {
        return [];
      }

      this.loadingOlder = true;
      const requestVersion = this.surroundingRequestVersion;
      const lastEvent = this.resources[this.resources.length - 1];

      try {
        let events = await api
          .refresh({
            cursor: lastEvent.id,
            muted: this.surroundingMuted,
          })
          .catch((err) => null);

        if (
          requestVersion !== this.surroundingRequestVersion ||
          this.mode !== "surrounding"
        ) {
          return [];
        }

        if (!events) {
          return [];
        }

        this.hasOlder = events.length > this.surroundingPageSize;
        events = events.slice(0, this.surroundingPageSize);
        this.resources = mergeEvents([this.resources, events]);

        return events;
      } finally {
        if (requestVersion === this.surroundingRequestVersion) {
          this.loadingOlder = false;
        }
      }
    },

    leaveSurrounding: function () {
      this.latestParamsVersion += 1;
      this.surroundingRequestVersion += 1;

      const savedTimeline = this.savedTimeline;

      this.mode = "latest";
      this.anchorEventId = null;
      this.surroundingMuted = false;
      this.hasNewer = false;
      this.hasOlder = false;
      this.loadingNewer = false;
      this.loadingOlder = false;
      this.savedTimeline = null;

      if (!savedTimeline) {
        this.resources = [];
        return null;
      }

      this.resources = savedTimeline.resources;
      this.skip = savedTimeline.skip;
      this.take = savedTimeline.take;
      this.cursor = savedTimeline.cursor;
      this.query = savedTimeline.query;
      this.category = savedTimeline.category;
      this.mentions = savedTimeline.mentions;
      this.muted = savedTimeline.muted;

      return savedTimeline;
    },

    doAction: async function (action) {
      let event = null;

      this.resources.map((resource) => {
        if (resource.actions) {
          for (let i = 0; i < resource.actions.length; i++) {
            let ra = resource.actions[i];

            if (ra.id === action.id) {
              event = resource;
              break;
            }
          }
        }
      });

      if (!event) {
        console.log("WTF, log not found");
        return;
      }

      let res = await api.doAction(action, event).catch((err) => {
        throw err;
      });

      if (!res) {
        return false;
      }

      this.resources = this.resources.map((r) => {
        if (r.id === res.id) {
          return res;
        } else {
          return r;
        }
      });

      if (this.savedTimeline) {
        this.savedTimeline.resources = this.savedTimeline.resources.map((r) => {
          if (r.id === res.id) {
            return res;
          }

          return r;
        });
      }

      return true;
    },
  },
});
