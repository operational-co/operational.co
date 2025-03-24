import prisma from "#lib/prisma.js";
import { format } from "sql-formatter";

const mysql = {
	async cleanParams(params) {
		let skip = params.skip || 0;
		let take = params.take || 20;
		let query = params.query || "";
		let cursor = params.cursor || null;
		let workspaceId = params.workspaceId || undefined;

		let newParams = {
			skip,
			take,
			query,
			cursor,
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

		let where = [`workspaceId = ${params.workspaceId}`, `contextType = 0`];

		if (params.test) {
			where.push(`test = 1`);
		} else {
			where.push(`test = 0`);
		}

		if (params.query && typeof params.query === "string") {
			let q = params.query.toLowerCase();
			where.push(`b.searchable LIKE '%${params.query}`);
		}

		if (params.category) {
			where.push(`category = '${params.category}'`);
		}

		if (params.cursor) {
			let initialEvent = await this.findOne(params.cursor);

			const createdAt = new Date(initialEvent.createdAt)
				.toISOString()
				.replace("T", " ")
				.replace("Z", "");

			if (initialEvent) {
				let clause = `(createdAt > '${createdAt}')`;
				where.push(clause);
			} else {
				console.log(params.cursor);
			}
		}

		where = `WHERE ${where.join(" AND ")}`;

		let orderBy = `
    ORDER BY b.createdAt DESC
		`;

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

	async findLatest(params) {
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

		let where = [`workspaceId = ${params.workspaceId}`, `contextType = 0`];

		if (params.test) {
			where.push(`test = 1`);
		} else {
			where.push(`test = 0`);
		}

		if (params.query && typeof params.query === "string") {
			let q = params.query.toLowerCase();
			where.push(`b.searchable LIKE '%${params.query}`);
		}

		if (params.category) {
			where.push(`category = '${params.category}'`);
		}

		if (params.cursor) {
			let initialEvent = await this.findOne(params.cursor);

			const createdAt = new Date(initialEvent.createdAt)
				.toISOString()
				.replace("T", " ")
				.replace("Z", "");

			if (initialEvent) {
				let clause = `(createdAt > '${createdAt}')`;
				where.push(clause);
			} else {
				console.log(params.cursor);
			}
		}

		where = `WHERE ${where.join(" AND ")}`;

		let orderBy = `
    ORDER BY b.createdAt ASC
		`;

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

	async getEventCount(payload) {
		let tableName = "Event";
		let testCondition = "0";
		if (payload.test) {
			testCondition = "1";
		}
		let query = `
    SELECT COUNT(*) AS event_count
    FROM ${tableName}
    WHERE workspaceId = ${payload.workspaceId}
      AND createdAt >= '${payload.startDate}'
      AND createdAt <= '${payload.endDate}'
      AND test = '${testCondition}'
  `;

		query = format(query, {
			language: "mysql",
			tabWidth: 2,
			linesBetweenQueries: 2,
		});

		try {
			let results = await this.getResults(query);

			results = await this.cleanResults(results);

			const rawCount = results[0]?.event_count || 0n;
			const count = Number(rawCount);

			return count;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	async getCategories(params) {
		const limit = 10000;
		let date = moment.utc().subtract(2, "hours").startOf("hour").toISOString();
		date = date.replace("Z", "");

		let query = `
		SELECT category
FROM Events
WHERE workspaceId = ${params.workspaceId}
  AND category != ''
  AND category IS NOT NULL
	ORDER BY createdAt DESC
	LIMIT ${limit};
	`;

		query = format(query, {
			language: "mysql",
			tabWidth: 2,
			linesBetweenQueries: 2,
		});

		let results = await this.getResults(query);

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
		const res =
			await prisma.$queryRaw`SELECT * FROM Event WHERE id = ${id} LIMIT 1`;
		return res[0] || null;
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
