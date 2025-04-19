import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";
import Filter from "#lib/class-filter.js";
import moment from "moment";
import Db from "#services/db/index.js";

class LogFilter extends Filter {
	// async cleanParams(params) {
	// 	let skip = params.skip || 0;
	// 	let take = params.take || 20;
	// 	let query = params.query || "";
	// 	let workspaceId = params.workspaceId;

	// 	let newParams = {
	// 		skip,
	// 		take,
	// 		query,
	// 		workspaceId,
	// 	};

	// 	return newParams;
	// }

	async createSql(params) {
		let tableName = this.tableName;
		let mode = `BOOLEAN`;

		let select = `
		SELECT
			b.id,
      b.createdAt,
      b.workspaceId,
      b.content,
      b.type,
      b.actions,
      b.avatar,
      b.muted,
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

		sql = this.format(sql, {
			language: "mysql",
			tabWidth: 2,
			linesBetweenQueries: 2,
		});

		this.log(sql);

		return sql;
	}
}

const filter = new LogFilter("Log");

class Log extends Model {
	parseString(input) {
		const emailPattern = /email:([^ ]+)/;
		const match = input.match(emailPattern);

		if (match) {
			const email = match[1];
			const search = input.replace(emailPattern, "").trim();
			return {
				email: email,
				search: search,
			};
		} else {
			return {
				email: null,
				search: input.trim(),
			};
		}
	}

	async find(params) {
		return await Db.find(params);
	}

	async findUserByEmail(params) {
		return await Db.findUserByEmail(params);
	}

	async find(params) {
		let query = params.query;
		if (query) {
			let parsedQuery = this.parseString(query);
			if (parsedQuery.email) {
				let user = await this.findUserByEmail({
					email: parsedQuery.email,
					workspaceId: params.workspaceId,
				});
				if (user) {
					params.mentions = [user.userId];
				}
			}
			if (parsedQuery.search) {
				params.query = parsedQuery.search;
			} else {
				params.query = null;
			}
		}
		return await Db.find(params);
	}

	async findLatest(params) {
		let query = params.query;
		if (query) {
			let parsedQuery = this.parseString(query);
			if (parsedQuery.email) {
				let user = await this.findUserByEmail({
					email: parsedQuery.email,
					workspaceId: params.workspaceId,
				});
				if (user) {
					params.mentions = [user.userId];
				}
			}
			if (parsedQuery.search) {
				params.query = parsedQuery.search;
			} else {
				params.query = null;
			}
		}
		return await Db.findLatest(params);
	}

	async findContexts(params) {
		return await Db.findContexts(params);
	}

	async findById(id, testMode = false) {
		return await Db.findOne(id, testMode);
	}

	async getEventCount(params) {
		return await Db.getEventCount(params);
	}

	async getCategories(params) {
		return await Db.getCategories(params);
	}

	async getEventCount(params) {
		return await Db.getEventCount(params);
	}

	async updateActions(event, newActions, testMode = false) {
		let payload = {
			...event,
			actions: newActions,
		};

		let res = await Db.updateOne(payload, testMode).catch((err) => {
			console.log(err);
			throw err;
		});

		event.actions = newActions;

		return event;
	}

	async ingest(obj) {
		try {
			const log = await this.client.create({
				data: { ...obj },
			});

			return log;
		} catch (err) {
			throw err;
		}
	}

	async batchInsertJobs(jobs) {
		let condition = await this.client.createMany({
			data: jobs,
		});

		return condition;
	}
}

export default new Log("Log", prisma);
