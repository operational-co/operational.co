import prisma from "#lib/prisma.js";
import { format } from "sql-formatter";
import moment from "moment";
import config from "#lib/config.js";

const mysql = {
	async cleanParams(params) {
		let skip = params.skip || 0;
		let take = params.take || 20;
		let query = params.query || "";
		let cursor = params.cursor || null;
		let category = params.category || null;
		let workspaceId = params.workspaceId || undefined;

		let newParams = {
			skip,
			take,
			query,
			cursor,
			category,
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

		let tableName = "Events";
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
			b.contextType,

			(
		    CASE 
		      WHEN b.contextId IS NOT NULL THEN (
		        SELECT JSON_ARRAYAGG(
		          JSON_OBJECT(
		            'id', e.id,
		            'name', e.name,
		            'createdAt', e.createdAt,
		            'content', e.content,
		            'type', e.type,
		            'actions', e.actions,
		            'avatar', e.avatar,
		            'test', e.test,
		            'errors', e.errors,
		            'category', e.category,
		            'contextId', e.contextId,
		            'contextType', e.contextType
		          )
		        )
		        FROM ${tableName} e
		        WHERE
		          e.workspaceId = b.workspaceId
		          AND e.contextType = 1
		          AND e.contextId = b.contextId
		      )
		      ELSE NULL
		    END
		  ) AS contexts
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
				let clause = `(createdAt < '${createdAt}')`;
				where.push(clause);
			} else {
				//console.log(params.cursor);
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

		//console.log(sql);
		console.time("sql");
		let results = await this.getResults(sql);
		console.timeEnd("sql");
		//console.log(results);

		results = await this.cleanResults(results);

		return results;
	},

	async findLatest(params) {
		params = await this.cleanParams(params);

		let tableName = "Events";
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

		//console.log(sql);

		let results = await this.getResults(sql);

		results = await this.cleanResults(results);

		return results;
	},

	async getEventCount(payload) {
		let tableName = "Events";
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
		let tableName = "Events";
		const limit = 10000;
		let date = moment.utc().subtract(2, "hours").startOf("hour").toISOString();
		date = date.replace("Z", "");

		let query = `
		SELECT category
FROM ${tableName}
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
		const tableName = "Events";
		const res =
			await prisma.$queryRaw`SELECT * FROM ${tableName} WHERE id = ${id} LIMIT 1`;
		return res[0] || null;
	},

	async updateOne(payload) {
		let id = payload.id;
		delete payload.id;

		let res = await prisma.Events.update({
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
		let res = await prisma.events.create(query);

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

	async removeOldEvents() {
		const days = config.REMOVE_EVENTS_AFTER;
		const hours = days * 24;
		const currentDate = new Date();
		const hoursAgo = new Date(currentDate - hours * 60 * 60 * 1000);

		const result = await prisma.$executeRaw`
		  DELETE FROM Event
		  WHERE createdAt < ${hoursAgo}
		    AND test = false
		`;

		return result;
	},

	async removeTestEvents() {
		const days = config.REMOVE_TEST_EVENTS_AFTER;
		const hours = days * 24;
		const currentDate = new Date();
		const hoursAgo = new Date(currentDate - hours * 60 * 60 * 1000);

		const result = await prisma.$executeRaw`
		  DELETE FROM Event
		  WHERE createdAt < ${hoursAgo}
		    AND test = true
		`;

		return result;
	},
};

export default mysql;
