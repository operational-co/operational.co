import { defineStore } from "pinia";

import CrudStore from "@/lib/crud-store.js";

import http, { setToken } from "@/lib/http.js";

import { useAppStore } from "../store/app";

import localstorage from "@/lib/localstorage.js";

const api = {
  refresh: async function (params = {}) {
    const options = {
      params: {
        ...params,
      },
    };
    try {
      const res = await http.get("/workspace", options);

      return res.data || [];
    } catch (err) {
      throw err;
    }
  },

  update: async function (form) {
    try {
      const res = await http.put("/workspace/", form);

      return res.data || null;
    } catch (err) {
      throw err;
    }
  },

  activate: async function (form) {
    try {
      const res = await http.post("/workspace/activate", form);

      return res.data || null;
    } catch (err) {
      throw err;
    }
  },

  create: async function (form) {
    try {
      const res = await http.post("/workspace", form);

      return res.data || null;
    } catch (err) {
      throw err;
    }
  },

  inviteUser: async function (form) {
    try {
      const res = await http.post("/workspace/invite-user", form);
      return res.data || null;
    } catch (err) {
      throw err;
    }
  },

  removeUser: async function (form) {
    try {
      const res = await http.post("/workspace/remove-user", form);
      return res.data || null;
    } catch (err) {
      throw err;
    }
  },

  checkInvite: async function (form) {
    try {
      const res = await http.post("/workspace/check-invite", form);
      return res.data || null;
    } catch (err) {
      throw err;
    }
  },

  acceptInvite: async function (form) {
    try {
      const res = await http.post("/workspace/accept-invite", form);
      return res.data || null;
    } catch (err) {
      throw err;
    }
  },
};

const config = {
  name: "workspace",
  isSingleton: true,
};

const workspaceStore = new CrudStore(config, api);

export const workspaceApi = api;

export const useWorkspaceStore = defineStore(config.name, {
  state: function () {
    return {
      ...workspaceStore.exportState(),

      skip: 0,
      take: 20,
      query: "",
    };
  },
  getters: {
    ...workspaceStore.exportGetters(),

    isAuth: function (state) {
      if (state.resource) {
        return true;
      }

      return false;
    },

    isDemo: function (state) {
      if (state.resource && state.resource.status === "DEMO") {
        return true;
      }

      return false;
    },
  },
  actions: {
    ...workspaceStore.exportActions(),

    init: async function () {},

    consumePie: async function (pie) {
      if (pie) {
        this.resource = pie.workspace;
        return true;
      }
    },

    refresh: async function () {
      const params = {
        skip: this.skip,
        query: this.query,
      };
      const logs = await api.refresh(params).catch((err) => {});

      this.resources = logs || [];
    },

    update: async function (form = {}) {
      const res = await api.update(form).catch((err) => {
        throw err;
      });

      if (!res) {
        throw "Something went wrong";
      }

      const app = useAppStore();

      if (res) {
        // app.sendNotification({
        // 	type: "success",
        // 	message: `Settings updated!`,
        // });
        if (!res.users) {
          let users = JSON.parse(JSON.stringify(this.resource.users || []));

          this.resource = res;

          this.resource.users = users;
        } else {
          this.resource = res;
        }
      } else {
        return;
      }

      return res;
    },

    updatePassword: async function (form = {}) {
      const res = await api.updatePassword(form).catch((err) => {
        throw err;
      });

      if (!res) {
        throw "Something went wrong";
      }

      this.resource = res;

      const app = useAppStore();

      if (res) {
        app.sendNotification({
          type: "success",
          message: `Password updated!`,
        });
        this.resource = res;
      } else {
      }
    },

    updateEmail: async function (form = {}) {
      const res = await api.updateEmail(form).catch((err) => {
        throw err;
      });

      if (!res) {
        throw "Something went wrong";
      }

      this.resource = res;

      const app = useAppStore();

      if (res) {
        app.sendNotification({
          type: "success",
          message: `Email updated!`,
        });
        this.resource = res;
      } else {
      }
    },

    headlessLogin: async function () {
      const token = localstorage.get("token");

      if (!token) {
        return false;
      }

      setToken(token);

      const user = await api.headlessLogin();

      if (user) {
        this.resource = user;
        return true;
      } else {
        return false;
      }
    },

    logout: async function () {
      // also send an api request to remove the session, but dont wait for it
      api.logout();

      localstorage.remove("token");

      this.resource = null;
    },

    resetPasswordRequest: async function (form) {
      await api.resetPasswordRequest(form).catch((err) => {});

      return true;
    },

    finishOnboarding: async function () {
      let form = {
        onboarded: true,
      };
      const res = await api.update(form).catch((err) => {
        throw err;
      });

      if (!res) {
        throw "Something went wrong";
      }

      this.resource = res;

      const app = useAppStore();

      if (res) {
        app.sendNotification({
          type: "success",
          message: `Onboarded!`,
        });
        this.resource = res;
      } else {
        return;
      }

      return res;
    },

    create: async function (e) {
      await api.create(e).catch((err) => {
        throw err;
      });
    },

    inviteUser: async function (e) {
      try {
        const users = await api.inviteUser(e);
        this.resource.users = users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    removeUser: async function (e) {
      try {
        const users = await api.removeUser(e);
        console.log(users);
        this.resource.users = users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    checkInvite: async function (e) {
      try {
        const user = await api.checkInvite(e);
        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    acceptInvite: async function (e) {
      try {
        const data = await api.acceptInvite(e);
        return data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
});
