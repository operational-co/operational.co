import Events from "./model.js";

import axios from "axios";
import moment from "moment";
import prisma from "#lib/prisma.js";

const component = {
	async find(params) {
		const events = await Events.find(params);

		return events;
	},

	async findOne(params) {
		const event = await Events.findById(params.id, null, params.test);

		return event;
	},

	async findLatest(params) {
		const events = await Events.findLatest(params);

		return events;
	},

	async findContexts(params) {
		const events = await Events.findContexts(params);

		return events;
	},

	async doAction(action, event, params = {}) {
		const testMode = params.testMode;
		// first, verify if event exists(sanity check)
		event = await Events.findById(event.id, event._id, testMode).catch(
			(err) => {
				throw err;
			},
		);

		let actions = event.actions;

		if (!actions) {
			throw "Actions not found in event";
		}

		let successfulRequest = await this.sendAction(event, action).catch(
			(err) => {
				throw err;
			},
		);

		if (successfulRequest.error) {
			return successfulRequest;
		}

		let condition = false;

		for (let i = 0; i < actions.length; i++) {
			let a = actions[i];

			if (typeof a === "string") {
				try {
					a = JSON.parse(a);
				} catch {
					a = null;
				}
			}

			if (a.id === action.id) {
				// disallow future button clicked if !action.repeat
				if (!action.repeat) {
					a.status = "DONE";
				}
				if (action.repeat === -1) {
					a.status = "DONE";
				}
				a.lastClicked = moment.utc().toISOString(); // save actioned date
				actions[i] = a;
				condition = true;
			} else {
				if (a) {
					actions[i] = a;
				}
			}
		}

		if (!condition) {
			throw `Action not found`;
		}

		event = await Events.updateActions(event, actions, testMode);

		return event;
	},

	async sendAction(event, action) {
		let a = null;

		for (let i = 0; i < event.actions.length; i++) {
			let ac = event.actions[i];

			if (typeof ac === "string") {
				try {
					ac = JSON.parse(ac);
				} catch {
					ac = null;
				}
			}

			if (!ac) {
				continue;
			}

			if (ac.id === action.id) {
				a = ac;
				break;
			}
		}

		if (!a) {
			throw `Action with key ${action.key} not found`;
		}

		let url = a.url;
		url = new URL(url);
		url = url.toString();

		let res = null;

		let form = {
			event: {
				id: event._id,
				userId: event.userId,
				slug: a.slug,
				meta: a.meta || null,
				key: a.key,
				createdAt: event.createdAt,
			},
		};

		let config = {
			method: "post",
			url: url,
			data: form,
			//signal: AbortSignal.timeout(2 * 60 * 1000),
			timeout: 10000, // 10 seconds
			headers: {
				"Content-Type": "application/json",
			},
		};

		// then perform the action
		try {
			res = await axios(config);
		} catch (err) {
			console.log(err);
			//console.log(url);
			//console.log(err.response.data);

			if (err && err.response && err.response.data) {
				return {
					error: true,
					message: err.response.data,
				};
			}
		}

		let status = 400;

		if (res && res.status) {
			status = res.status;
		}

		let successStatuses = [200, 201];

		if (!successStatuses.includes(status)) {
			return {
				error: true,
				message: `Http status was ${status}`,
			};
		}

		return true;
	},

	async generateCommonEventNames(workspaceId) {
		let params = {
			workspaceId,
			take: 1000,
			projection: { name: 1, _id: 0 },
		};
		let maxLength = 20;

		let events = await Events.find(params);

		let counts = {};

		events.forEach((event) => {
			const name = event.name;
			if (counts[name]) {
				counts[name]++;
			} else {
				counts[name] = 1;
			}
		});

		let newNames = [];

		let keys = Object.keys(counts);

		// remove crappy values
		keys = keys.filter((item) => {
			if (item === "null") {
				return false;
			}
			return item != null;
		});

		keys = keys.slice(0, maxLength);

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];

			if (typeof key === "string") {
				newNames.push(key);
			}
		}

		return newNames;
	},

	async getEventsCountPerBillingCycle(workspaceId, dates) {
		const startDate = dates.periodStart;
		const endDate = dates.periodEnd;

		let params = {
			workspaceId,
			startDate,
			endDate,
		};

		let count = await Events.getEventCount(params);

		return count;
	},

	async computeCategories(workspaceId) {
		const params = {
			workspaceId: workspaceId,
		};
		let categories = await Events.getCategories(params).catch((err) => {
			throw err;
		});

		// Count the occurrences of each category
		const categoryCount = categories.reduce((acc, item) => {
			acc[item.category] = (acc[item.category] || 0) + 1;
			return acc;
		}, {});

		// Sort categories by popularity (count) in descending order
		const sortedCategories = Object.entries(categoryCount)
			.sort((a, b) => b[1] - a[1]) // Sort by count
			.slice(0, 10) // Get top 10 categories
			.map((item) => item[0]); // Get the category names

		// Fetch existing categories for the workspaceId to avoid duplicates
		const existingCategories = await prisma.category.findMany({
			where: {
				workspaceId: parseInt(workspaceId),
			},
			select: {
				text: true,
			},
		});

		// Get the existing category texts
		const existingTexts = existingCategories.map((category) => category.text);

		const uniqueCategories = [...new Set(existingTexts)];

		const newCategories = [];

		for (let i = 0; i < sortedCategories.length; i++) {
			let category = sortedCategories[i];

			if (uniqueCategories.includes(category)) {
				continue;
			}

			newCategories.push(category);
		}

		for (let i = 0; i < newCategories.length; i++) {
			let data = {
				workspaceId: parseInt(workspaceId),
				text: newCategories[i],
			};
			let c = await prisma.category.create({
				data: data,
			});

			//console.log(c);
		}

		//console.log(`${workspaceId}, ${newCategories.join(",")}`);

		return newCategories;
	},
};

export default component;
