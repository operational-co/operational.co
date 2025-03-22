import { ObjectId, UUID } from "mongodb";
import mongo from "#lib/mongodb.js";
import config from "#lib/config.js";
import { v7 as uuidv7 } from "uuid";

const mongodb = {
	async cleanResults(results) {
		//for (let i = 0; i < results.length; i++) {}

		return results;
	},

	async find(params) {
		params.take = params.take || config.events.take;

		let projection = null;

		if (params.projection) {
			projection = params.projection;
		}

		let collection = null;

		if (!params.test) {
			collection = mongo.db.collection("Event");
		} else {
			collection = mongo.db.collection("TestEvent");
		}

		let query = {
			workspaceId: params.workspaceId,
			contextType: 0,
		};

		if (params.cursor) {
			query._id = {
				$lt: new UUID(params.cursor),
			};
		}

		if (params.query) {
			query.$text = {
				$search: params.query,
			};
		}

		if (params.mentions) {
			if (typeof params.mentions !== "object") {
				params.mentions = [parseInt(params.mentions)];
			}
			query.userId = {
				$in: params.mentions,
			};
		}

		let results = [];

		if (!projection) {
			results = await collection
				.find(query)
				.sort({ _id: -1 })
				.limit(params.take)
				.toArray();
		} else {
			results = await collection
				.find(query)
				.sort({ _id: -1 })
				.project(projection)
				.limit(params.take)
				.toArray();
		}

		results = await this.cleanResults(results);

		let contexts = [];

		for (let i = 0; i < results.length; i++) {
			let res = results[i];

			if (res.contextId) {
				contexts.push(res.contextId);
			}
		}

		if (contexts.length > 0) {
			contexts = await this.findContexts(
				{
					contexts: contexts,
					workspaceId: params.workspaceId,
				},
				params.test,
			);

			if (contexts.length > 0) {
				for (let i = 0; i < results.length; i++) {
					let res = results[i];

					res.contexts = [];

					// interpolate contexts into res;
					if (res.contextId) {
						for (let j = 0; j < contexts.length; j++) {
							if (contexts[j].contextId === res.contextId) {
								res.contexts.push(contexts[j]);
							}
						}
					}
				}
			}
		}

		return results;
	},

	async getEventCount(params) {
		const collection = mongo.db.collection("Event");

		const query = {
			workspaceId: params.workspaceId,
			createdAt: {
				$gte: params.startDate,
				$lte: params.endDate,
			},
		};

		const count = await collection.countDocuments(query);

		return count;
	},

	async findContexts(params, testMode = false) {
		let contexts = params.contexts || [];

		if (typeof contexts === "string") {
			contexts = [contexts];
		}

		if (contexts.length === 0) {
			return [];
		}

		// max allowable contexts
		params.take = contexts.length * 100;

		let collection = mongo.db.collection("Event");

		if (testMode) {
			collection = mongo.db.collection("TestEvent");
		}

		let query = {
			workspaceId: params.workspaceId,
			contextId: { $in: contexts },
			contextType: 1,
		};

		let results = [];

		results = await collection
			.find(query)
			.sort({ _id: 1 })
			.limit(100)
			.toArray();

		results = await this.cleanResults(results);

		return results;
	},

	async findUser(params) {
		params.take = config.users.take;

		const collection = mongo.db.collection("User");
		// let index = await collection.createIndex({ email: "text" });
		// console.log(index);
		let query = {};

		if (params.limited) {
			params.take = 1000;
			params.projection = {
				userId: 1,
				email: 1,
				avatar: 1,
			};
		}

		if (!params.query) {
			query = params.cursor
				? { workspaceId: params.workspaceId, _id: { $gt: cursor } }
				: { workspaceId: params.workspaceId };
		} else {
			query = params.cursor
				? {
						workspaceId: params.workspaceId,
						_id: { $gt: cursor },
						$text: { $search: params.query },
					}
				: { workspaceId: params.workspaceId, $text: { $search: params.query } };
		}

		let results = [];

		if (params.projection) {
			results = await collection
				.find(query)
				.sort({ _id: -1 })
				.limit(params.take)
				.project(params.projection)
				.toArray();
		} else {
			results = await collection
				.find(query)
				.sort({ _id: -1 })
				.limit(params.take)
				.toArray();
		}

		results = await this.cleanResults(results);

		return results;
	},

	async findUserByEmail(params) {
		const collection = mongo.db.collection("User");

		let query = {
			workspaceId: params.workspaceId,
			email: params.email,
		};

		let results = await collection.find(query).limit(1).toArray();

		if (results[0]) {
			return results[0];
		} else {
			return null;
		}
	},

	async findOne(id, testMode = false) {
		const objectId = new UUID(id);

		let collection = mongo.db.collection("Event");

		if (testMode) {
			collection = mongo.db.collection("TestEvent");
		}

		let resource = await collection.findOne({ _id: objectId });

		return resource;
	},

	async updateOne(payload, testMode = false) {
		let id = payload._id;
		delete payload._id;

		const objectId = new UUID(id);

		let collection = mongo.db.collection("Event");

		if (testMode) {
			collection = mongo.db.collection("TestEvent");
		}

		let data = {
			$set: {
				actions: payload.actions || [],
			},
		};

		let res = await collection.updateOne({ _id: objectId }, data);

		return res;
	},

	async insertOne(payload) {
		// No need to generate the actual uuid since ingestion adds uuid
		if (payload._id) {
			payload._id = new UUID(payload._id);
		}
		const event = mongo.db.collection("Event");

		let result = null;

		if (!payload.test) {
			delete payload.test;
			result = await event.insertOne(payload);
		} else {
			delete payload.test;
			const testEvent = mongo.db.collection("TestEvent");
			result = await testEvent.insertOne(payload);
		}

		await this.insertOneTimeseries(payload);

		return result;
	},

	async insertOneTimeseries(payload) {
		let meta = {
			name: payload.name,
			type: payload.type,
			muted: payload.muted,
			notify: payload.notify,
			content: payload.content,
			searchable: payload.searchable,
			workspaceId: payload.workspaceId,
			userId: payload.userId,
		};

		delete payload.name;
		delete payload.type;
		delete payload.muted;
		delete payload.notify;
		delete payload.content;
		delete payload.searchable;
		delete payload.workspaceId;
		delete payload.userId;

		payload.meta = meta;

		const event = mongo.db.collection("TimeseriesEvent");

		const result = await event.insertOne(payload).catch((err) => {
			console.log(err);
		});
	},

	async insertUser(payload) {
		const collection = mongo.db.collection("User");
		let result = null;
		if (!payload.test) {
			delete payload.test;
			result = await collection.insertOne(payload);
		} else {
			delete payload.test;
			const testCollection = mongo.db.collection("TestUser");
			result = await testCollection.insertOne(payload);
		}

		return result;
	},

	async removeTestEvents() {
		return [];
		const currentDate = new Date();
		const fortyEightHoursAgo = new Date(currentDate - 48 * 60 * 60 * 1000); // Calculate 48 hours ago

		const events = await prisma.Event.findMany({
			where: {
				createdAt: {
					lt: fortyEightHoursAgo,
				},
				test: true,
			},
		});
	},
};

export default mongodb;
