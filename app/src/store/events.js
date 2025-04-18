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
					notify: true,
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
			const res = await http.get("/events/latest", options);
			return res.data || [];
		} catch (err) {
			throw err;
		}
	},
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
		},

		clear: function () {
			this.resources = [];
		},

		setParams: async function (params, refresh = false) {
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
			if (this.latestLock) {
				console.log("Denied because of lock");
				return;
			}

			this.latestLock = true;
			let events = this.resources;

			events = toRaw(events);

			if (!events) {
				return;
			}

			if (!events.length) {
				return;
			}

			let firstEvent = events[0];

			const cursor = firstEvent.id;

			const params = {
				cursor: cursor,
				category: this.category,
			};

			let newEvents = await api.latest(params).catch((err) => {});

			if (!newEvents) {
				newEvents = [];
			}

			newEvents = newEvents.reverse();

			if (newEvents && newEvents.length > 0) {
				this.resources.unshift(...newEvents);
			}

			this.latestLock = false;
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

			return true;
		},
	},
});
