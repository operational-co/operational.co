/**
 * Events db layer. We're using mysql for events storage for now
 */

import clickhouse from "./clickhouse.js";
import mysql from "./mysql.js";
import config from "#lib/config.js";

class Db {
	dbName = "clickhouse";

	constructor() {}

	async setup() {
		// const stats = await this.getStats();
		// console.log(stats);
	}

	cleanParams(params) {
		if (params.skip) {
			params.skip = parseInt(params.skip);
			if (isNaN(params.skip)) {
				params.skip = 0;
			}
		}

		let newParams = {
			skip: params.skip || 0,
			take: config.events.take,
			query: params.query || "",
			category: params.category || "",
			test: !!params.test || false,
			workspaceId: params.workspaceId,
			cursor: params.cursor || undefined,
		};

		return newParams;
	}

	getDbInstance() {
		let dbName = this.dbName || "clickhouse";
		if (dbName === "clickhouse") {
			return clickhouse;
		} else if (dbName === "mysql") {
			return mysql;
		}
		throw new Error(`Database "${this.dbName}" not supported`);
	}

	async find(params) {
		params = this.cleanParams(params);
		const db = this.getDbInstance();
		return await db.find(params);
	}

	async findLatest(params) {
		params = this.cleanParams(params);
		const db = this.getDbInstance();
		return await db.findLatest(params);
	}

	async getEventCount(params) {
		const db = this.getDbInstance();
		return await db.getEventCount(params);
	}

	async findContexts(params) {
		const db = this.getDbInstance();
		return await db.findContexts(params);
	}

	async findOne(id, _id, testMode = false) {
		const db = this.getDbInstance();
		return await db.findOne(id, testMode);
	}

	async updateOne(payload, testMode = false) {
		const db = this.getDbInstance();
		return await db.updateOne(payload, testMode);
	}

	async insertOne(payload) {
		const db = this.getDbInstance();
		return await db.insertOne(payload);
	}

	async removeTestEvents() {
		const db = this.getDbInstance();
		return await db.removeTestEvents();
	}

	async getCategories(params) {
		const db = this.getDbInstance();
		return await db.getCategories(params);
	}

	async getEventCount(params) {
		const db = this.getDbInstance();
		return await db.getEventCount(params);
	}

	async getStats() {
		const db = this.getDbInstance();
		const stats = await db.getStats();
		return stats;
	}
}

export default new Db();
