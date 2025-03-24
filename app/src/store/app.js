import { defineStore } from "pinia";

import CrudStore from "@/lib/crud-store.js";

import http from "@/lib/http.js";

import { useEventsStore } from "./events";
import { useCrmStore } from "./crm";
import { useUserStore } from "./user";
import { useReportsStore } from "./reports";
import { useWorkspaceStore } from "./workspace";
import { useMetricStore } from "./metric";

const api = {
	refresh: async function () {
		try {
			const res = await http.get("/crm/user");

			return res.data || [];
		} catch (err) {
			throw err;
		}
	},
	subscribePush: async function (subscription) {
		try {
			const res = await http.post("/website/subscribe-push", subscription);
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	unsubscribePush: async function (subscription) {
		try {
			const res = await http.post("/website/unsubscribe-push", subscription);
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	activate: async function (form) {
		try {
			const res = await http.post("/workspace/activate", form);
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	sendTestPushNotification: async function () {
		try {
			const res = await http.post("/website/send-test-push-notification");
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getStats: async function () {
		try {
			const res = await http.get("/website/stats");
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	checkConnection: async function () {
		try {
			const res = await http.post("/website/connection");
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};

const config = {
	name: "app",
	isSingleton: false,
};

const appStore = new CrudStore(config, api);

export const appApi = api;

export const useAppStore = defineStore(config.name, {
	state: function () {
		return {
			...appStore.exportState(),

			notification: null,

			appInit: false,

			loading: false,

			onboarding: false,

			docs: false,

			testMode: false,

			offline: false,

			permissionModal: false,
			pwaModal: false,
			switchWorkspace: false,
			createWorkspace: false,

			displayMode: "browser tab",

			isPwa: false,

			// service worker registration
			registration: null,

			baseUrl: import.meta.env.VITE_APP_URL || `http://localhost:8080`,
			baseApiUrl: import.meta.env.VITE_API_URL || `http://localhost:2000`,
		};
	},
	getters: {
		...appStore.exportGetters(),

		isSelfHosted: function () {
			if (
				import.meta.env.VITE_SELFHOSTED &&
				import.meta.env.VITE_SELFHOSTED === "true"
			) {
				return true;
			}
			return false;
		},
	},
	actions: {
		...appStore.exportActions(),

		async init() {
			const events = useEventsStore();
			const crm = useCrmStore();
			const user = useUserStore();
			const reports = useReportsStore();
			const workspace = useWorkspaceStore();
			const metric = useMetricStore();

			let pie = await user.init();
			await events.init();
			await crm.init();
			await reports.init();
			await workspace.init();
			await metric.init();

			if (user.isAuth && pie) {
				await this.afterLogin(pie);
			} else {
				// do something else
			}

			this.appInit = true;
		},

		async afterLogin(pie) {
			const events = useEventsStore();
			const crm = useCrmStore();
			const reports = useReportsStore();
			const workspace = useWorkspaceStore();
			const metric = useMetricStore();

			await metric.consumePie(pie);
			await workspace.consumePie(pie);
			await events.consumePie(pie);
			await crm.consumePie(pie);
			await reports.consumePie(pie);
		},

		async sendTestPushNotification() {
			return await api.sendTestPushNotification();
		},

		async sendNotification(notification) {
			if (typeof notification === "object" && notification.message) {
				this.notification = notification;
				return;
			}

			if (typeof notification === "string") {
				let payload = {
					message: notification,
					timer: 3000,
				};
				this.notification = payload;
			}
		},

		async getStats() {
			return await api.getStats();
		},

		async subscribePush(subscription) {
			await api.subscribePush(subscription);
		},

		async unsubscribePush(subscription) {
			//await api.unsubscribePush(unsubscribePush);
		},

		async checkConnection() {
			try {
				const connection = await api.checkConnection();
				return connection;
			} catch (err) {
				throw err;
			}
		},

		setLoading(condition) {
			this.loading = condition;
		},

		startOnboarding() {
			this.onboarding = true;
		},

		stopOnboarding() {
			this.onboarding = false;
		},

		showDocs() {
			this.docs = true;
		},

		hideDocs() {
			this.docs = false;
		},

		setTestMode(condition) {
			this.testMode = condition;
		},

		setPermissionModal(condition) {
			this.permissionModal = condition;
		},

		setPwaModal(condition) {
			this.pwaModal = condition;
		},

		setDisplayMode(mode) {
			this.displayMode = mode;
		},

		setSwitchWorkspace() {
			this.switchWorkspace = true;
		},

		setCreateWorkspace(condition) {
			this.createWorkspace = condition;
		},

		setOffline(condition) {
			this.offline = condition;
		},
	},
});
