import prisma from "#lib/prisma.js";
import { format } from "sql-formatter";
import moment from "moment";
import config from "#lib/config.js";

const mysql = {
  escapeLikeValue(value = "") {
    return String(value).replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
  },

  async cleanParams(params) {
    return params || {};
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

  getEventSelect() {
    return {
      id: true,
      workspaceId: true,
      userId: true,
      name: true,
      actions: true,
      avatar: true,
      content: true,
      type: true,
      muted: true,
      test: true,
      notify: true,
      searchable: true,
      contextId: true,
      contextType: true,
      createdAt: true,
      errors: true,
      category: true,
    };
  },

  buildWhere(params) {
    const where = {
      workspaceId: Number(params.workspaceId),
      contextType: params.hasContextStart ? (params.contextStart ? 0 : 1) : 0,
      test: !!params.test,
      muted: !!params.muted,
    };

    if (params.query) {
      where.searchable = {
        contains: this.escapeLikeValue(params.query),
      };
    }

    if (params.category) {
      where.category = params.category;
    }

    if (params.mentions && params.mentions.length) {
      where.userId = {
        in: params.mentions,
      };
    }

    if (params.contextId) {
      where.contextId = params.contextId;
    }

    return where;
  },

  async attachContexts(results, workspaceId, testMode) {
    const contextIds = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (
        item.contextType === 0 &&
        item.contextId &&
        !contextIds.includes(item.contextId)
      ) {
        contextIds.push(item.contextId);
      }
    }

    if (!contextIds.length) {
      return results;
    }

    const contexts = await this.findContexts(
      {
        contexts: contextIds,
        workspaceId,
      },
      testMode,
    );

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (!item.contextId || item.contextType !== 0) {
        continue;
      }

      item.contexts = [];
      for (let j = 0; j < contexts.length; j++) {
        if (contexts[j].contextId === item.contextId) {
          item.contexts.push(contexts[j]);
        }
      }
    }

    return results;
  },

  async find(params) {
    params = await this.cleanParams(params);
    const where = this.buildWhere(params);

    if (params.cursor) {
      const initialEvent = await this.findOne(
        params.cursor,
        params.test,
        params.workspaceId,
        false,
      );

      if (!initialEvent) {
        return [];
      }

      where.OR = [
        { createdAt: { lt: initialEvent.createdAt } },
        {
          createdAt: initialEvent.createdAt,
          id: { lt: initialEvent.id },
        },
      ];
    }

    const results = await prisma.events.findMany({
      where,
      select: this.getEventSelect(),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: params.skip,
      take: params.take,
    });

    return await this.attachContexts(results, params.workspaceId, params.test);
  },

  async findLatest(params) {
    params = await this.cleanParams(params);
    const where = this.buildWhere(params);

    if (params.cursor) {
      const initialEvent = await this.findOne(
        params.cursor,
        params.test,
        params.workspaceId,
        false,
      );

      if (!initialEvent) {
        return [];
      }

      where.OR = [
        { createdAt: { gt: initialEvent.createdAt } },
        {
          createdAt: initialEvent.createdAt,
          id: { gt: initialEvent.id },
        },
      ];
    }

    const results = await prisma.events.findMany({
      where,
      select: this.getEventSelect(),
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip: params.skip,
      take: params.take,
    });

    return await this.attachContexts(results, params.workspaceId, params.test);
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

  async removeWorkspaceEvents(workspaceId) {
    return await prisma.events.deleteMany({
      where: {
        workspaceId: Number(workspaceId),
      },
    });
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

  async findContexts(params, testMode = false) {
    const contextIds = Array.isArray(params.contexts) ? params.contexts : [];

    if (!contextIds.length || !params.workspaceId) {
      return [];
    }

    return await prisma.events.findMany({
      where: {
        workspaceId: Number(params.workspaceId),
        contextType: 1,
        contextId: {
          in: contextIds,
        },
        test: !!testMode,
      },
      select: this.getEventSelect(),
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: 500,
    });
  },

  async findOne(id, testMode = false, workspaceId, includeContexts = true) {
    const where = {
      id: String(id || ""),
      test: !!testMode,
    };

    if (workspaceId != null && workspaceId !== "") {
      where.workspaceId = Number(workspaceId);
    }

    const result = await prisma.events.findFirst({
      where,
      select: this.getEventSelect(),
    });

    if (!result) {
      return null;
    }

    if (!includeContexts) {
      return result;
    }

    const results = await this.attachContexts([result], result.workspaceId, result.test);
    return results[0] || null;
  },

  async updateOne(payload) {
    let id = payload.id;
    delete payload.id;
    delete payload.contexts;

    let res = await prisma.events.update({
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
