import { defineStore } from "pinia";
import CrudStore from "@/lib/crud-store.js";
import http from "@/lib/http.js";
import { useAppStore } from "./app.js";

import { toRaw } from "vue";

const api = {
  find: async function (params = {}) {
    params = JSON.parse(JSON.stringify(params));

    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get("/dashboards", options);
      return res.data || [];
    } catch (err) {
      throw err;
    }
  },

  updateWidgets: async function (form = {}) {
    try {
      const res = await http.put(`/dashboards/${form.dashboardId}/widgets`, form.widgets);
      return res.data || [];
    } catch (err) {
      throw err;
    }
  },

  createWidget: async function (form = {}) {
    try {
      const res = await http.post(`/dashboards/${form.dashboardId}/widgets`, form);
      return res.data || null;
    } catch (err) {
      throw err;
    }
  },

  removeWidget: async function (form = {}) {
    try {
      const res = await http.delete(
        `/dashboards/${form.dashboardId}/widgets/${form.widgetId}`,
        form,
      );
      return res.data || true;
    } catch (err) {
      throw err;
    }
  },

  doAction: async function (form) {
    try {
      const res = await http.post(
        `/dashboards/${form.dashboardId}/widgets/${form.id}/action`,
        form,
      );

      return res.data || [];
    } catch (err) {
      throw err;
    }
  },
};

const config = {
  name: "dashboards",
  isSingleton: false,
};

const dashboardsStore = new CrudStore(config, api);

export const dashboardsApi = api;

export const useDashboardsStore = defineStore(config.name, {
  state: function () {
    return {
      ...dashboardsStore.exportState(),

      skip: 0,
      take: 20,
      cursor: null,
      query: "",
      category: "",
      mentions: [],
      muted: false,

      latestLock: false,

      editId: null,

      // a fully realized dashboard with widgets and data
      currentDashboard: null,
    };
  },
  getters: {
    ...dashboardsStore.exportGetters(),
  },
  actions: {
    ...dashboardsStore.exportActions(),

    async init(pie) {
      if (!pie) {
        return;
      }
      if (pie.workspace && pie.workspace.dashboards) {
        // this will be lightweight dashboards without widgets and data
        this.resources = pie.workspace.dashboards;

        delete pie.workspace.dashboards;
      }
    },

    async updateWidgets(dashboardId, widgets) {
      let form = {
        dashboardId,
        widgets,
      };

      try {
        const res = await api.updateWidgets(form);
        return res.data || [];
      } catch (err) {
        throw err;
      }
    },

    async createWidget(form) {
      try {
        const res = await api.createWidget(form);
        return res || null;
      } catch (err) {
        throw err;
      }
    },

    async removeWidget(form) {
      try {
        const res = await api.removeWidget(form);
        return res.data || true;
      } catch (err) {
        throw err;
      }
    },

    doAction: async function (action) {
      let res = await api.doAction(action, event).catch((err) => {
        throw err;
      });

      if (!res) {
        return false;
      }

      return true;
    },

    setEdit: function (editId) {
      this.editId = editId;
    },
  },
});
