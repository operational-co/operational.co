import { defineStore } from "pinia";

import CrudStore from "@/lib/crud-store.js";

import http from "@/lib/http.js";

const api = {
  get: async function () {
    try {
      const res = await http.get("/invoice");
      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
  download: async function (invoice) {
    let fileName = `${invoice.code}.pdf`;
    let config = {
      responseType: "arraybuffer",
    };
    let response = await http.post(`/invoice/${invoice.id}/download`, {}, config).catch((err) => {
      throw err;
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); //or any other extension
    document.body.appendChild(link);
    link.click();

    return response.data || [];
  },
};

const config = {
  name: "invoices",
  isSingleton: false,
};

const invoicesStore = new CrudStore(config, api);

export const invoicesApi = api;

export const useInvoicesStore = defineStore(config.name, {
  state: function () {
    return {
      ...invoicesStore.exportState(),

      skip: 0,
      take: 20,
      query: "",
    };
  },
  getters: {
    ...invoicesStore.exportGetters(),
  },
  actions: {
    ...invoicesStore.exportActions(),

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
      if (this.resources && this.resources.length > 0) {
        return this.resources;
      }

      const invoices = await api.get().catch((err) => {});

      this.resources = this.resources.concat(invoices);

      return invoices;
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

    download: async function (invoice) {
      await api.download(invoice);
    },
  },
});
