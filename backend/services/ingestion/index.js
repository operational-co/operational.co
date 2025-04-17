import Key from "#services/key/index.js";
import Webpush from "#services/webpush/index.js";
import moment from "moment";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import path from "path";

import Log from "#components/events/model.js";
import Db from "#services/db/index.js";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 16);

async function saveToJson(payload) {
	let id = payload._id;
	let fileName = `${id}.json`;

	const __dirname = path.resolve("");

	let filePath = path.join(__dirname, `./public/${fileName}`);

	const jsonData = JSON.stringify(payload);

	// Write JSON string to file
	await writeFile(filePath, jsonData, "utf8");

	console.log(`JSON data saved to ${filePath}`);
}

class Ingestion {
	jobs = [];
	interval = 1000;

	types = ["text", "map", "image", "json", "rows"];

	async setup() {
		setInterval(() => {
			this.processJobs();
		}, this.interval);
	}

	async identify(payload, apikey) {
		let workspaceId = await Key.validate(apikey);

		if (!workspaceId) {
			throw `Apikey is invalid or disabled`;
		}

		payload = {
			// Use this to map event to user2
			userId: payload.userId,

			workspaceId,

			// Basic user details
			firstName: payload.firstName || "",
			lastName: payload.lastName || "",
			email: payload.email || "",
			avatar: payload.avatar || "",
			timezone: payload.timezone || "",
			test: payload.test || false,
		};

		await Db.insertUser(payload);

		return true;
	}

	async testIngest() {
		let apikey = `ops_niceoneniceone`;

		let event = {
			type: "rows",
			avatar: "🤘",
			name: "User signed up",
			notify: true,
			context: "134_signup",
			contextStart: true,
			category: "cron",
			content: [
				{ type: "text", label: "Name", content: "fsadsg fraegrsfbg" },
				{
					type: "text",
					label: "Email",
					content: "Email: efradgs@mailinator.com",
				},
				{ type: "text", label: "IP", content: "IP: ::1" },
				{
					type: "text",
					label: "Workspace",
					content: "Workspace name: fdsvgsb",
				},
				{ type: "text", label: "Referral", content: "" },
			],
			actions: [
				{
					key: "test-action-1",
					url: "https://api.swipekit.app/user/ban?email=efradgs@mailinator.com&id=134",
					buttonText: "Ban user?",
				},
				{
					key: "test-action-2",
					url: "https://api.swipekit.app/user/activate?email=efradgs@mailinator.com&id=134",
					buttonText: "Activate user?",
				},
				{
					key: "test-action-3",
					url: "https://mailinator.com",
					external: true,
					buttonText: "View website",
				},
			],
		};

		await this.ingest(event, apikey).catch((err) => {
			console.log(err);
		});
	}

	/**
	 * Ingestion works in parts
	 * 1 - Scour for common formatting mistakes
	 * 2 - Check apikey
	 * 3 - Pack everything in
	 */
	async ingest(payload, apikey) {
		let types = this.types;

		// assume default type to be text
		if (!payload.type) {
			payload.type = "text";
		}

		if (payload.type === "cards") {
			payload.type = "rows";
		}

		if (!types.includes(payload.type)) {
			throw `type field must include one of the following: ${types.join(
				",",
			)} . Currently it has ${payload.type}`;
		}

		if (!payload.content && !payload.name) {
			throw `content field is required`;
		}

		let name = payload.name || undefined;

		if (name && name.length > 48) {
			name = name.substring(0, 48);
		}

		let notify = payload.notify || false;
		notify = !!notify;

		let test = payload.test || false;
		test = !!test;

		let avatar = payload.avatar || null;

		if (typeof avatar !== "string") {
			avatar = undefined;
		}

		//let contextType = payload.contextType || 0;
		let contextId = payload.contextId || "";
		let contextStart = payload.contextStart || false;

		let contextType = 0;
		if (contextId && !contextStart) {
			contextType = 1;
		}

		let category = null;
		if (payload.category) {
			category = payload.category;
			if (category.length > 24) {
				category = category.substring(0, 24);
			}
		}

		payload = {
			avatar,
			name,
			userId: payload.userId || undefined,
			type: payload.type,
			content: payload.content || undefined,
			actions: payload.actions || null,
			_apikey: apikey,
			notify,
			test,
			category,
			contextId,
			contextType,
		};

		payload.searchable = this.generateSearchable(payload);

		payload = await this.part1(payload).catch((err) => {
			throw err;
		});

		payload = await this.part2(payload);

		return payload;
	}

	async part1(payload) {
		let obj = await Key.validate(payload._apikey);
		if (!obj) {
			throw `Apikey is invalid or disabled`;
		}
		const workspaceId = obj.workspaceId;

		if (!workspaceId) {
			throw `Apikey is invalid or disabled`;
		}

		try {
			payload = this.verifyPayload(payload);
		} catch (err) {
			throw err;
		}

		delete payload._apikey;

		payload._notifiers = obj.notifiers || [];

		payload.workspaceId = workspaceId;

		/* This should get us the utc date in iso8601 format
			https://stackoverflow.com/questions/25725019/how-do-i-format-a-date-as-iso-8601-in-moment-js
			*/
		payload.createdAt = moment().toISOString();

		return payload;
	}

	async part2(payload) {
		payload.id = uuidv4();

		if (payload.notify) {
			let newPayload = JSON.parse(JSON.stringify(payload));
			Webpush.sendEventNotification(newPayload);
		}

		// not part of the schema, remove it
		delete payload._notifiers;

		// To ensure objects have the keys in a specific order
		//payload = this.reorderObjectKeys(payload);
		await Db.insertOne(payload);

		//await saveToJson(payload);

		return payload;
	}

	async processJobs() {
		if (this.jobs.length > 0) {
			// process em

			await Log.batchInsertJobs(this.jobs);

			// then clear out the queue
			this.jobs = [];
		} else {
		}
	}

	verifyPayload(payload) {
		if (payload.type === "rows") {
			try {
				payload = this.verifyRows(payload);
			} catch (err) {
				throw err;
			}
		}

		if (payload.actions && payload.actions.length === 0) {
			payload.actions = null;
		}

		if (payload.actions) {
			try {
				payload = this.verifyActions(payload);
			} catch (err) {
				throw err;
			}
		} else {
			// just in case
			delete payload.actions;
		}

		return payload;
	}

	verifyRows(payload) {
		if (!payload.content) {
			throw "content needs to have some data";
		}
		if (payload.content.length === 0) {
			throw "content needs to have some data";
		}

		for (let i = 0; i < payload.content.length; i++) {
			let card = payload.content[i];

			try {
				this.verifyRow(card, i);
			} catch (err) {
				throw err;
			}
		}

		//payload.content = JSON.stringify(payload.content);

		return payload;
	}

	verifyRow(row, i) {
		if (!row.type) {
			row.type = "text";
		}
		if (!row.type) {
			row.type = "text";
		}
		if (row.type === "rows") {
			throw `card's type shouldn't be rows`;
		}
		if (!this.types.includes(row.type)) {
			throw `card's type should be one of ${this.types.join(",")}`;
		}
		if (!row.content) {
			row.content = "";
		}

		return true;
	}

	verifyActions(payload) {
		let actions = payload.actions;

		if (!actions.length) {
			throw "actions should have at least 1 action";
		}

		for (let i = 0; i < actions.length; i++) {
			let action = actions[i];

			try {
				this.verifyAction(action);
			} catch (err) {
				throw err;
			}

			action.external = !!action.external;

			action.id = nanoid();
			action.key = action.key;
			action.meta = action.meta || null;
			action.status = "PENDING";
			action.external = action.external || false;

			payload.actions[i] = action;
		}

		return payload;
	}

	verifyAction(action) {
		if (!action.url) {
			throw "Action needs to have a valid url";
		}

		if (!action.buttonText) {
			throw "Action needs to have buttonText";
		}

		if (action.buttonText.length > 48) {
			throw "buttonText is too long. Should be under 48 chars";
		}

		if (!action.key && !action.external) {
			throw `Action needs to have a key or be marked as external`;
		}

		if (typeof action.meta === "object" && !!action.meta === true) {
		}

		action.lastClicked = null;

		// by default, don't allow repeatable actions
		if (action.repeat) {
			action.repeat = 1;
		} else {
			action.repeat = -1;
		}

		// implement action.timeout, action.repeat(can be null, int or -1)(-1 means indefinite)

		// implement action.expirein

		// By default, actions cannot be run beyond 7 days
		// action.expireIn is in minutes

		if (typeof action.expireIn !== "number") {
			action.expireIn = 10080; // 60 x 24 x 7
		}

		return true;
	}

	generateSearchable(payload) {
		let searchable = "";
		if (payload.type === "log" || payload.type === "text") {
			searchable = payload.content || "";

			return `${payload.name || ""} ${searchable}`;
		}

		if (payload.type === "rows" && payload.content) {
			for (let i = 0; i < payload.content.length; i++) {
				let card = payload.content[i];

				if (card.type === "log" || card.type === "text") {
					searchable = `${searchable} ${card.content}`;
				}
			}
		}

		if (searchable.length > 220) {
			searchable = searchable.slice(0, 220);
		}

		return `${payload.name || ""} ${searchable}`;
	}

	reorderObjectKeys(obj) {
		let keysOrder = [
			"_id",
			"avatar",
			"name",
			"userId",
			"type",
			"content",
			"actions",
			"notify",
			"test",
			"contextId",
			"contextType",
			"searchable",
			"workspaceId",
			"createdAt",
		];

		const reorderedObject = {};

		keysOrder.forEach((key) => {
			if (obj.hasOwnProperty(key)) {
				reorderedObject[key] = obj[key];
			} else {
				reorderedObject[key] = null;
			}
		});

		return reorderedObject;
	}
}

export default new Ingestion();
