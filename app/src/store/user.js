import { defineStore } from "pinia";
import CrudStore from "@/lib/crud-store.js";
import http, { setToken } from "@/lib/http.js";
import { useAppStore } from "../store/app";
import localstorage from "@/lib/localstorage.js";
import multipartUpload from "@/lib/multipart-upload.js";

const api = {
	refresh: async function (params = {}) {
		const options = {
			params: {
				...params,
			},
		};
		try {
			const res = await http.get("/user", options);

			return res.data || [];
		} catch (err) {
			throw err;
		}
	},

	setup: async function (form = {}) {
		try {
			const res = await http.post("/user/setup", form);

			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	login: async function (form = {}) {
		try {
			const res = await http.post("/user/login", form);
			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	signup: async function (form = {}) {
		try {
			const res = await http.post("/user/signup", form);

			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	headlessLogin: async function () {
		try {
			const res = await http.post("/user/headless-login");

			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	logout: async function () {
		try {
			const res = await http.post("/user/logout");

			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	update: async function (form) {
		try {
			const res = await multipartUpload(form, http, "put", "/user/");
			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	updatePassword: async function (form) {
		try {
			const res = await http.put("/user/password", form);

			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	updateEmail: async function (form) {
		try {
			const res = await http.put("/user/email", form);

			return res.data || null;
		} catch (err) {
			throw err;
		}
	},

	createIntent: async function () {
		try {
			const res = await http.post("/user/create-intent");
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	resetPasswordRequest: async function (form) {
		try {
			const res = await http.post("/user/reset-password-request", form);
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	switchWorkspace: async function (form) {
		try {
			const res = await http.post(
				`/user/switch-workspace/${form.newWorkspace}`,
			);
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	getBillingData: async function () {
		const url = `/user/get-billing-data`;
		try {
			const res = await http.post(url);
			return res.data || [];
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	cancelSubscription: async function (form = {}) {
		const url = `/user/cancel-subscription`;
		form = {
			...form,
		};
		try {
			const res = await http.post(url, form);
			return res.data || null;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	demoLogin: async function (form = {}) {
		const url = `/user/demo-login`;
		try {
			const res = await http.post(url, form);

			return res.data || null;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};

const config = {
	name: "user",
	isSingleton: true,
};

const userStore = new CrudStore(config, api);

export const userApi = api;

export const useUserStore = defineStore(config.name, {
	state: function () {
		return {
			...userStore.exportState(),

			skip: 0,
			take: 20,
			query: "",
		};
	},
	getters: {
		...userStore.exportGetters(),

		isAuth: function (state) {
			if (state.resource) {
				return true;
			}

			return false;
		},
	},
	actions: {
		...userStore.exportActions(),

		init: async function () {
			let pie = await this.headlessLogin().catch((err) => {});

			return pie;
		},

		refresh: async function () {
			const params = {
				skip: this.skip,
				query: this.query,
			};
			const logs = await api.refresh(params).catch((err) => {});

			this.resources = logs || [];
		},

		login: async function (form = {}) {
			form.userAgent = navigator.userAgent;
			const pie = await api.login(form).catch((err) => {
				throw err;
			});

			if (!pie) {
				return;
			}

			const app = useAppStore();

			await this.consumePie(pie);

			await app.afterLogin(pie);

			app.sendNotification({
				type: "success",
				message: `Welcome ${this.resource.firstName}`,
			});

			return pie;
		},

		getOS: function () {
			var OSName = "Unknown";
			let ua = window.navigator.userAgent;
			if (ua.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10";
			if (ua.indexOf("Windows NT 6.3") != -1) OSName = "Windows 8.1";
			if (ua.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8";
			if (ua.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7";
			if (ua.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista";
			if (ua.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP";
			if (ua.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000";
			if (ua.indexOf("Mac") != -1) OSName = "Mac/iOS";
			if (ua.indexOf("X11") != -1) OSName = "UNIX";
			if (ua.indexOf("Linux") != -1) OSName = "Linux";

			return OSName;
		},

		processEnvironment: function (config = {}) {
			let data = {
				browser: "",
				screenX: 1400,
				screenY: 900,
				os: "",
			};

			const d = new Date();
			let diff = d.getTimezoneOffset();

			diff = diff / 60;

			diff = -diff;

			if (typeof window === "undefined") {
				return data;
			}

			let isIE = /*@cc_on!@*/ false || !!document.documentMode;
			let isEdge = (!isIE && !!window.StyleMedia) || "";
			let screenX = window.screen.width || "";
			let screenY = window.screen.height || "";
			let browserName = "";

			if (navigator.userAgent.indexOf("Chrome") != -1 && !isEdge) {
				browserName = "chrome";
			} else if (navigator.userAgent.indexOf("Safari") != -1 && !isEdge) {
				browserName = "safari";
			} else if (navigator.userAgent.indexOf("Firefox") != -1) {
				browserName = "firefox";
			} else if (
				navigator.userAgent.indexOf("MSIE") != -1 ||
				!!document.documentMode == true
			) {
				//IF IE > 10
				browserName = "ie";
			} else if (isEdge) {
				browserName = "edge";
			} else {
				browserName = "other-browser";
			}

			let os = this.getOS();

			data.browser = browserName;
			data.screenX = screenX;
			data.screenY = screenY;
			data.os = os;
			data.utcOffset = diff;

			return data;
		},

		signup: async function (form = {}) {
			var w = window.innerWidth;
			var h = window.innerHeight;
			let config = this.processEnvironment();

			form.meta = {
				...config,
			};

			const pie = await api.signup(form).catch((err) => {
				throw err;
			});

			if (!pie) {
				return;
			}

			const app = useAppStore();

			await this.consumePie(pie);

			await app.afterLogin(pie);

			if (pie) {
				let temp = JSON.parse(JSON.stringify(pie));
				delete temp.workspace;
				this.resource = temp;
				app.sendNotification({
					type: "success",
					message: `Welcome to Operational, ${this.resource.firstName}`,
				});
				app.startOnboarding();
			} else {
				return false;
			}
		},

		setup: async function (form = {}) {
			var w = window.innerWidth;
			var h = window.innerHeight;
			let config = this.processEnvironment();

			form.meta = {
				...config,
			};

			const pie = await api.setup(form).catch((err) => {
				throw err;
			});

			if (!pie) {
				return;
			}

			const app = useAppStore();

			await this.consumePie(pie);

			await app.afterLogin(pie);

			if (pie) {
				let temp = JSON.parse(JSON.stringify(pie));
				delete temp.workspace;
				this.resource = temp;
				app.sendNotification({
					type: "success",
					message: `Welcome to Operational, ${this.resource.firstName}`,
				});
				app.startOnboarding();
			} else {
				return false;
			}
		},

		update: async function (form = {}, opts = { update: true }) {
			const res = await api.update(form).catch((err) => {
				throw err;
			});

			if (!res) {
				throw "Something went wrong";
			}

			if (res && opts && opts.update) {
				this.resource = res;
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

			const pie = await api.headlessLogin();

			await this.consumePie(pie);

			return pie;
		},

		consumePie: async function (pie) {
			if (!pie) {
				return;
			}
			let user = JSON.parse(JSON.stringify(pie));
			delete user.workspace;

			this.resource = user;

			return true;
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

		cancelSubscription: async function (e) {
			await api.cancelSubscription(e);
		},

		async attemptDemoLogin(name) {
			// Someone is already logged in so return
			if (this.isAuth) {
				return;
			}

			try {
				const pie = await api.demoLogin({
					name: name,
				});

				console.log(pie);

				if (!pie) {
					return;
				}

				const app = useAppStore();

				await this.consumePie(pie);

				await app.afterLogin(pie);

				app.sendNotification({
					type: "success",
					message: `Welcome to ${this.resource.firstName}'s demo account`,
				});

				return pie;
			} catch (err) {
				console.log(err);

				throw err;
			}
		},
	},
});
