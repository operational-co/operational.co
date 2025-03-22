import prisma from "#lib/prisma.js";
import { format } from "sql-formatter";

const mysql = {
	async cleanParams(params) {
		let skip = params.skip || 0;
		let take = params.take || 20;
		let query = params.query || "";
		let workspaceId = params.workspaceId || undefined;

		let newParams = {
			skip,
			take,
			query,
			workspaceId,
		};

		return newParams;
	},

	async getResults(sql) {
		let results = await prisma.$queryRawUnsafe(sql).catch((err) => {
			console.log(err);
			throw err;
		});

		return results || [];
	},

	async cleanResults(results) {
		for (let i = 0; i < results.length; i++) {}

		return results;
	},

	async find(params) {
		params = await this.cleanParams(params);

		let tableName = "Event";
		let mode = `BOOLEAN`;

		let select = `
		SELECT
			b.id,
      b.name,
      b.createdAt,
      b.workspaceId,
      b.content,
      b.type,
      b.actions,
      b.avatar,
      b.test,
			b.errors,
			b.category,
			b.contextId,
			b.contextType
		`;

		let where = `
		`;

		let orderBy = `
    ORDER BY b.createdAt DESC
		`;

		if (params.query) {
			where = `${where}
      WHERE
        workspaceId = ${params.workspaceId}
			  AND b.searchable LIKE '%${params.query}%'
			`;
		} else {
			where = `${where}
      WHERE
        workspaceId = ${params.workspaceId}
			`;
		}

		let sql = `
			${select}
    FROM ${tableName} b
		${where} 
		${orderBy}
		LIMIT ${params.take} OFFSET ${params.skip};
		`;

		sql = format(sql, {
			language: "mysql",
			tabWidth: 2,
			linesBetweenQueries: 2,
		});

		let results = await this.getResults(sql);

		results = await this.cleanResults(results);

		return results;
	},

	async findUser(params) {
		params = await this.cleanParams(params);

		let tableName = "User2";
		let mode = `BOOLEAN`;

		let select = `
		SELECT
			b.id,
      b.firstName,
      b.lastName,
      b.createdAt,
      b.workspaceId,
      b.email,
      b.avatar,
      b.timezone,
      b.fields,
      b.test
		`;

		let where = `
		`;

		let orderBy = `
    ORDER BY b.createdAt DESC
		`;

		if (params.query) {
			where = `${where}
      WHERE
        workspaceId = ${params.workspaceId}
			  AND b.firstName LIKE '%${params.query}%'
			`;
		} else {
			where = `${where}
      WHERE
        workspaceId = ${params.workspaceId}
			`;
		}

		let sql = `
			${select}
    FROM ${tableName} b
		${where} 
		${orderBy}
		LIMIT ${params.take} OFFSET ${params.skip};
		`;

		sql = format(sql, {
			language: "mysql",
			tabWidth: 2,
			linesBetweenQueries: 2,
		});
		let results = await this.getResults(sql);

		results = await this.cleanResults(results);

		return results;
	},

	async findOne(id) {
		let res = await prisma.Event.findUnique({
			where: {
				id: id,
			},
		});

		return res;
	},

	async updateOne(payload) {
		let id = payload.id;
		delete payload.id;

		let res = await prisma.Event.update({
			where: {
				id,
			},
			data: {
				...payload,
			},
		});

		return res;
	},

	async insertOne(payload) {
		if (payload.content && typeof payload.content === "object") {
			payload.content = JSON.stringify(payload.content);
		}
		if (payload._id) {
			delete payload._id;
		}
		let query = {
			data: {
				...payload,
			},
		};
		let res = await prisma.event.create(query);

		return res;
	},

	async insertUser(payload) {
		let query = {
			data: {
				...payload,
			},
		};
		let res = await prisma.User2.create(query);

		return res;
	},

	async removeTestEvents() {
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

		//console.log(events);
	},
};

export default mysql;
