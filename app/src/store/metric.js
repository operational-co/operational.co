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
			const res = await http.get("/metric", options);

			return res.data || [];
		} catch (err) {
			throw err;
		}
	},
	get: async function (params = {}) {
		const options = {
			params: {
				...params,
			},
		};
		try {
			const res = await http.get("/metric", options);

			return res.data || [];
		} catch (err) {
			throw err;
		}
	},
};

const config = {
	name: "metric",
	isSingleton: false,
};

const metricStore = new CrudStore(config, api);

export const metricApi = api;

export const useMetricStore = defineStore(config.name, {
	state: function () {
		return {
			...metricStore.exportState(),

			skip: 0,
			take: 20,
			query: "",
		};
	},
	getters: {
		...metricStore.exportGetters(),

		isAuth: function (state) {
			if (state.resource) {
				return true;
			}

			return false;
		},
	},
	actions: {
		...metricStore.exportActions(),

		init: async function () {},

		consumePie: async function (pie) {
			if (pie && pie.workspace && pie.workspace.metrics) {
				this.resources = pie.workspace.metrics || [];
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

			this.resource = res;

			const app = useAppStore();

			if (res) {
				app.sendNotification({
					type: "success",
					message: `Settings updated!`,
				});
				this.resource = res;
			} else {
				return;
			}

			return res;
		},

		load: async function (form = {}) {
			let newResources = await api.get();
			if (newResources) {
				this.resources.splice(0, this.resources.length, ...newResources);
			}
		},
	},
});
