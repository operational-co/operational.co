import { defineStore } from "pinia";

import CrudStore from "@/lib/crud-store.js";

import http from "@/lib/http.js";

const api = {
  refresh: async function (params) {
    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get("/crm", options);

      return res.data || [];
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

const config = {
  name: "crm",
  isSingleton: false,
};

const crmStore = new CrudStore(config, api);

export const crmApi = api;

export const useCrmStore = defineStore(config.name, {
  state: function () {
    return {
      ...crmStore.exportState(),

      skip: 0,
      take: 20,
      query: "",
    };
  },
  getters: {
    ...crmStore.exportGetters(),
  },
  actions: {
    ...crmStore.exportActions(),

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
      const users = await api.refresh(params).catch((err) => {});

      this.resources = this.resources.concat(users);

      return true;
    },

    refresh: async function () {
      const params = {
        skip: this.skip,
        query: this.query,
      };
      const users = await api.refresh(params).catch((err) => {});

      this.resources = users || [];

      return true;
    },
  },
});
