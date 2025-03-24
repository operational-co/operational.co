import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";
import Filter from "#lib/class-filter.js";
import moment from "moment";
import Db from "#services/db/index.js";

class CrmFilter extends Filter {
  async cleanParams(params) {
    let skip = params.skip || 0;
    let take = params.take || 20;
    let query = params.query || "";
    let workspaceId = params.workspaceId;

    let newParams = {
      skip,
      take,
      query,
      workspaceId,
    };

    return newParams;
  }

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

const filter = new CrmFilter("Log");

class Crm extends Model {
  async find(params) {
    return await Db.findUser(params);
  }

  async findById(id) {
    return await Db.findOne(id);
  }

  async updateActions(event, newActions) {
    let payload = {
      ...event,
      actions: newActions,
    };

    let res = await Db.updateOne(payload);

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

export default new Crm("Crm", prisma);
