import Apikey from "#models/apikey.js";
import WorkspaceModel from "#components/workspace/model.js";
import prisma from "#lib/prisma.js";

import { nanoid } from "nanoid";
import moment from "moment";

import generateApikey from "#lib/generate-apikey.js";

class Key {
	cache = []; // [{key:123,workspaceId : 123,notifiers : [1,2]}]
	lastUpdate = null;
	loaded = false;

	async setup() {
		// Purposefully removed async so it doesn't hold up startup times
		this.inSetup();

		return true;
	}

	async inSetup() {
		// get all keys and build cache
		await this.buildCache();

		// Once cache is loaded(warmed up), set loaded to true to ensure all api requests fetch the key from the cache
		this.loaded = true;

		// Then rebuild cache every 10 seconds(stopgap measure)
		setInterval(() => {
			this.buildCache();
		}, 10000);
	}

	/**
	 * Validates a (api)key and returns an object if a key is found(either from cache or from db)
	 * @param {*} key
	 * @returns {
	 * 	key : key,
	 * 	workspaceId : 1, // workspaceId
	 * 	notifiers : [1,2,3] // userIds
	 * }
	 */
	async validate(key) {
		if (!key) {
			return;
		}
		// Until cache hasn't been loaded, fetch key directly from the db.
		if (!this.loaded) {
			let temp = await Apikey.client.findUnique({
				where: {
					key: key,
				},
				select: {
					workspaceId: true,
				},
			});
			if (temp) {
				// Importantly, this doesn't set notifiers. That's fine since fetching from db is a rare scenario
				return {
					key,
					workspaceId: temp.workspaceId,
					notifiers: [],
				};
			} else {
				return null;
			}
		}

		// Otherwise, check cache.
		return this.checkCache(key);
	}

	checkCache(key) {
		let len = this.cache.length;
		let result = null;
		for (let i = 0; i < len; i++) {
			if (key === this.cache[i].key) {
				result = this.cache[i];
				break;
			}
		}

		return result;
	}

	async buildCache() {
		const workspaces = await prisma.workspace.findMany({
			where: {
				status: {
					in: ["HOLD", "NORMAL", "DEMO", "TRIAL"],
				},
			},
			include: {
				keys: true, // Include associated ApiKeys
				users: {
					select: {
						notify: true,
						userId: true, // Only select the userId from WorkspaceUser
					},
				},
			},
		});

		let arr = [];

		for (let i = 0; i < workspaces.length; i++) {
			let workspace = workspaces[i];
			let notifiers = workspace.users.filter((user) => {
				if (user.notify) {
					return true;
				}
				return false;
			});

			notifiers = notifiers.map((n) => {
				return n.userId;
			});

			for (let j = 0; j < workspace.keys.length; j++) {
				let key = workspace.keys[j];

				let obj = {
					key: key.key,
					workspaceId: workspace.id,
					notifiers,
				};

				arr.push(obj);
			}
		}

		//console.log(arr);

		this.cache = arr;
	}

	/**
	 *
	 * Add/remove keys based on given workspace's status
	 */
	async onWorkspaceChange(workspaceId) {
		// For now, we'll just bruteforce our cache to rebuild
		await this.buildCache();
	}

	/**
	 *
	 * Generate a key
	 */
	async generate(workspaceId, description = "") {
		let key = generateApikey();

		let obj = {
			key,
			description,
			workspaceId,
		};

		key = await Apikey.client
			.create({
				data: {
					...obj,
				},
			})
			.catch((err) => {
				throw err;
			});

		// need to let ingestion know about this key

		// then also regenerate the cache -  no need to await
		this.buildCache();

		return key;
	}
}

export default new Key();
