import { defineStore } from "pinia";

import CrudStore from "@/lib/crud-store.js";

import http from "@/lib/http.js";

const api = {
  refresh: async function (params = {}) {
    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get("/reports", options);

      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
  doAction: async function (action = {}, log) {
    const form = {
      action,
      log,
    };
    try {
      const res = await http.post(`/reports/action`, form);

      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
};

const config = {
  name: "reports",
  isSingleton: false,
};

const reportsStore = new CrudStore(config, api);

export const reportsApi = api;

export const useReportsStore = defineStore(config.name, {
  state: function () {
    return {
      ...reportsStore.exportState(),

      skip: 0,
      take: 20,
      query: "",
    };
  },
  getters: {
    ...reportsStore.exportGetters(),
  },
  actions: {
    ...reportsStore.exportActions(),

    setParams: async function (params, refresh = false) {
      if (typeof params.skip === "number") {
        this.skip = params.skip;
      }

      if (typeof params.query === "string") {
        this.query = params.query;
      }

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
      };
      const logs = await api.refresh(params).catch((err) => {});

      this.resources = this.resources.concat(logs);

      return true;
    },

    refresh: async function () {
      const params = {
        skip: this.skip,
        query: this.query,
      };
      const logs = await api.refresh(params).catch((err) => {});

      this.resources = logs || [];

      return true;
    },

    doAction: async function (action) {
      let log = null;

      this.resources.map((resource) => {
        if (resource.actions) {
          for (let i = 0; i < resource.actions.length; i++) {
            let ra = resource.actions[i];

            if (ra.slug === action.slug) {
              log = resource;
              break;
            }
          }
        }
      });

      if (!log) {
        console.log("WTF, log not found");
        return;
      }

      let res = await api.doAction(action, log).catch((err) => {
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

      return true;
    },
  },
});
