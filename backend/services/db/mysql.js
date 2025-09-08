import prisma from "#lib/prisma.js";
import { format } from "sql-formatter";
import moment from "moment";
import config from "#lib/config.js";

const mysql = {
  async cleanParams(params) {
    let skip = params.skip || 0;
    let take = params.take || 20;
    let query = params.query || "";
    let test = params.test || false;
    let cursor = params.cursor || null;
    let category = params.category || null;
    let workspaceId = params.workspaceId || undefined;

    let newParams = {
      skip,
      take,
      query,
      test,
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
    let testMode = "";

    if (params.test) {
      testMode = `AND e.test = 1`;
    }

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
							${testMode}
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
    const limit = params.limit || 10000;
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
    const query = `SELECT * FROM ${tableName} WHERE id = "${id}" LIMIT 1`;

    const res = await prisma.$queryRawUnsafe(query);
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
		  DELETE FROM Events
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
		  DELETE FROM Events
		  WHERE createdAt < ${hoursAgo}
		    AND test = true
		`;

    return result;
  },

  async getStatData(schema, workspaceId) {
    const days = schema.date === "7 days" ? 7 : schema.date === "30 days" ? 30 : 60;

    // [start, end) in UTC
    const startDT = moment
      .utc()
      .startOf("day")
      .subtract(days - 1, "days");
    const endDT = moment.utc().startOf("day").add(1, "day");

    const start = new Date(startDT.toISOString());
    const end = new Date(endDT.toISOString());

    // match by field
    const field = schema.type === "category" ? "category" : "name";
    const title = String(schema.title || "");
    const agg = (schema.aggregate || "TOTAL").toUpperCase();

    if (agg === "TOTAL") {
      const sql = `
      SELECT COUNT(*) + 0 AS value
      FROM \`Events\`
      WHERE \`workspaceId\` = ?
        AND \`${field}\` = ?
        AND \`createdAt\` >= ?
        AND \`createdAt\` <  ?
    `;
      const rows = await prisma.$queryRawUnsafe(sql, Number(workspaceId), title, start, end);
      return Number(rows?.[0]?.value ?? 0);
    }

    // MAX / AVERAGE over daily counts (only days that had events)
    const inner = `
    SELECT DATE(\`createdAt\`) AS d, COUNT(*) AS c
    FROM \`Events\`
    WHERE \`workspaceId\` = ?
      AND \`${field}\` = ?
      AND \`createdAt\` >= ?
      AND \`createdAt\` <  ?
    GROUP BY d
  `;
    const wrap =
      agg === "MAX"
        ? `SELECT IFNULL(MAX(c), 0) AS value FROM (${inner}) AS t`
        : `SELECT IFNULL(AVG(c), 0) AS value FROM (${inner}) AS t`;

    const rows = await prisma.$queryRawUnsafe(wrap, Number(workspaceId), title, start, end);
    return Number(rows?.[0]?.value ?? 0);
  },

  async getLineData(schema, workspaceId) {
    // 1) window (7|30|60|365 days)
    let days = schema.date === "7 days" ? 7 : schema.date === "30 days" ? 30 : 60;
    if (schema.date === "1 year") days = 365;

    const startDT = moment
      .utc()
      .startOf("day")
      .subtract(days - 1, "days");
    const endDT = moment.utc().startOf("day").add(1, "day"); // [start, end)

    // Precompute ISO buckets (exactly N days, UTC midnight)
    const buckets = [];
    for (let i = 0; i < days; i++) {
      buckets.push(startDT.clone().add(i, "days").toISOString()); // "YYYY-MM-DDT00:00:00.000Z"
    }

    const sels = Array.isArray(schema.dataSelectors) ? schema.dataSelectors : [];
    const results = [];

    for (let i = 0; i < sels.length; i++) {
      const s = sels[i] || {};
      // whitelist field to avoid injection
      const field = s.selector === "category" ? "category" : "name";
      const value = String(s.text || "");

      // MySQL daily counts in [start, end)
      const sql = `
      SELECT
        DATE_FORMAT(createdAt, '%Y-%m-%d') AS d,
        COUNT(*) + 0 AS c
      FROM \`Events\`
      WHERE \`workspaceId\` = ?
        AND \`${field}\` = ?
        AND \`createdAt\` >= ?
        AND \`createdAt\` <  ?
      GROUP BY d
      ORDER BY d ASC
    `;

      // Use JS Dates so Prisma binds properly (UTC)
      const rows = await prisma.$queryRawUnsafe(
        sql,
        Number(workspaceId),
        value,
        new Date(startDT.toISOString()),
        new Date(endDT.toISOString()),
      );

      // Build a map d -> c, where d is "YYYY-MM-DD"
      const map = Object.create(null);
      for (let j = 0; j < rows.length; j++) {
        const r = rows[j];
        const dayKey = String(r.d); // "YYYY-MM-DD"
        const count = Number(r.c) || 0;
        map[dayKey] = count;
      }

      // Zero-fill to full window using our ISO buckets
      const series = [];
      for (let j = 0; j < buckets.length; j++) {
        const iso = buckets[j]; // "YYYY-MM-DDT00:00:00.000Z"
        const key = iso.slice(0, 10); // "YYYY-MM-DD"
        const y = map[key] != null ? map[key] : 0;
        series.push({ x: iso, y: y });
      }

      // Attach selector metadata (kept like your CH version)
      results.push({
        text: s.text ?? "",
        selector: s.selector ?? "event",
        aggregate: s.aggregate ?? "CUMULATIVE",
        data: series,
      });
    }

    return results; // [ { text, selector, aggregate, data:[{x,y}...] }, ... ]
  },
};

export default mysql;
