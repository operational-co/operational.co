import moment from "moment";
import config from "#lib/config.js";
import { performance } from "perf_hooks";
import Clickhouse from "#services/clickhouse/index.js";

const clickhouse = {
  buildEventQuery(params, direction = "older") {
    const where = [
      "workspaceId = {workspaceId:UInt32}",
      `contextType = ${params.hasContextStart ? (params.contextStart ? 0 : 1) : 0}`,
      "test = {test:UInt8}",
      "muted = {muted:UInt8}",
    ];
    const queryParams = {
      workspaceId: Number(params.workspaceId),
      test: params.test ? 1 : 0,
      muted: params.muted ? 1 : 0,
    };

    if (params.query) {
      where.push("positionCaseInsensitiveUTF8(ifNull(searchable, ''), {search:String}) > 0");
      queryParams.search = params.query;
    }

    if (params.category) {
      where.push("category = {category:String}");
      queryParams.category = params.category;
    }

    if (params.mentions && params.mentions.length) {
      where.push("userId IN {mentions:Array(String)}");
      queryParams.mentions = params.mentions;
    }

    if (params.contextId) {
      where.push("contextId = {contextId:String}");
      queryParams.contextId = params.contextId;
    }

    if (params.cursorCreatedAt) {
      const operator = direction === "newer" ? ">" : "<";
      const idOperator = direction === "newer" ? ">" : "<";
      where.push(
        `(createdAt ${operator} toDateTime64({cursorCreatedAt:String}, 3) OR (createdAt = toDateTime64({cursorCreatedAt:String}, 3) AND id ${idOperator} {cursorId:String}))`,
      );
      queryParams.cursorCreatedAt = params.cursorCreatedAt;
      queryParams.cursorId = params.cursorId;
    }

    return {
      where: where.join(" AND "),
      queryParams,
    };
  },

  async attachContexts(results, workspaceId, testMode) {
    const contextIds = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (
        Number(item.contextType) === 0 &&
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
      if (!item.contextId || Number(item.contextType) !== 0) {
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
    const table = "Events";
    const ch = Clickhouse.getCh();
    const take = params.take || config.events.take;

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
      params.cursorCreatedAt = moment
        .utc(initialEvent.createdAt)
        .format("YYYY-MM-DD HH:mm:ss.SSS");
      params.cursorId = initialEvent.id;
    }

    const filter = this.buildEventQuery(params, "older");
    const query = `SELECT DISTINCT ON (id) * FROM ${table} WHERE ${filter.where} ORDER BY createdAt DESC, id DESC LIMIT ${take} OFFSET ${params.skip || 0}`;

    const resultSet = await ch.query({
      query,
      query_params: filter.queryParams,
      format: "JSONEachRow",
    });
    const results = await resultSet.json();
    return await this.attachContexts(results, params.workspaceId, params.test);
  },

  async findLatest(params) {
    const table = "Events";
    const ch = Clickhouse.getCh();
    const take = params.take || config.events.take;

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
      params.cursorCreatedAt = moment
        .utc(initialEvent.createdAt)
        .format("YYYY-MM-DD HH:mm:ss.SSS");
      params.cursorId = initialEvent.id;
    }

    const filter = this.buildEventQuery(params, "newer");
    const query = `SELECT DISTINCT ON (id) * FROM ${table} WHERE ${filter.where} ORDER BY createdAt ASC, id ASC LIMIT ${take} OFFSET ${params.skip || 0}`;

    const resultSet = await ch.query({
      query,
      query_params: filter.queryParams,
      format: "JSONEachRow",
    });

    const results = await resultSet.json();
    return await this.attachContexts(results, params.workspaceId, params.test);
  },

  async getCategories(params) {
    const limit = params.limit || 10000;
    const ch = Clickhouse.getCh();
    let date = moment.utc().subtract(2, "hours").startOf("hour").toISOString();
    date = date.replace("Z", "");
    let query = `
		SELECT category
FROM Events
WHERE workspaceId = '${params.workspaceId}'
  AND category != ''
  AND category IS NOT NULL
	ORDER BY createdAt DESC
	LIMIT ${limit};
	`;

    //console.log(query);

    const resultSet = await ch.query({
      query: query,
      format: "JSONEachRow",
    });

    const results = await resultSet.json();

    //console.log(results);

    return results;
  },

  async findContexts(params, testMode = false) {
    const ch = Clickhouse.getCh();
    const contexts = Array.isArray(params.contexts) ? params.contexts : [];

    if (!contexts.length || !params.workspaceId) {
      return [];
    }

    const query = `SELECT DISTINCT ON (id) * FROM Events WHERE workspaceId = {workspaceId:UInt32} AND contextType = 1 AND test = {test:UInt8} AND contextId IN {contextIds:Array(String)} ORDER BY createdAt ASC, id ASC LIMIT 500`;

    const resultSet = await ch.query({
      query,
      query_params: {
        workspaceId: Number(params.workspaceId),
        test: testMode ? 1 : 0,
        contextIds: contexts,
      },
      format: "JSONEachRow",
    });

    const results = await resultSet.json();

    return results;
  },

  async findOne(id, testMode = false, workspaceId, includeContexts = true) {
    const ch = Clickhouse.getCh();
    const where = ["id = {id:String}", "test = {test:UInt8}"];
    const queryParams = {
      id: String(id || ""),
      test: testMode ? 1 : 0,
    };

    if (workspaceId != null && workspaceId !== "") {
      where.push("workspaceId = {workspaceId:UInt32}");
      queryParams.workspaceId = Number(workspaceId);
    }

    const query = `SELECT DISTINCT ON (id) * FROM Events WHERE ${where.join(" AND ")} ORDER BY version DESC LIMIT 1`;
    const resultSet = await ch.query({
      query,
      query_params: queryParams,
      format: "JSONEachRow",
    });

    const dataset = await resultSet.json();

    if (dataset[0]) {
      if (!includeContexts) {
        return dataset[0];
      }

      const results = await this.attachContexts(
        [dataset[0]],
        dataset[0].workspaceId,
        testMode,
      );
      return results[0] || null;
    } else {
      return null;
    }
  },

  async updateOne(payload, testMode = false) {
    const ch = Clickhouse.getCh();
    if (payload._id) {
      delete payload._id;
    }
    delete payload.contexts;

    payload.version++;

    let res = await ch.insert({
      table: "Events",
      format: "JSONEachRow",
      values: [payload],
    });

    return res;
  },

  async insertOne(payload) {
    const ch = Clickhouse.getCh();
    if (payload.content && typeof payload.content !== "string") {
      payload.content = JSON.stringify(payload.content);
    }
    if (payload.createdAt) {
      payload.createdAt = moment.utc(payload.createdAt).format("YYYY-MM-DD HH:mm:ss.SSS");
    }
    delete payload._id;
    let res = await ch.insert({
      table: "Events",
      format: "JSONEachRow",
      values: [payload],
    });

    return res;
  },

  async getEventCount(payload) {
    let testCondition = "0";
    if (payload.test) {
      testCondition = "1";
    }
    const ch = Clickhouse.getCh();
    const query = `
    SELECT COUNT(*) AS event_count
    FROM Events
    WHERE workspaceId = ${payload.workspaceId}
      AND createdAt >= '${payload.startDate}'
      AND createdAt <= '${payload.endDate}'
      AND test = '${testCondition}'
  `;

    try {
      const resultSet = await ch.query({
        query: query,
        format: "JSONEachRow",
      });

      const results = await resultSet.json();

      if (results && results.length > 0) {
        return parseInt(results[0].event_count);
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async removeOldEvents() {},

  async removeWorkspaceEvents(workspaceId) {
    const ch = Clickhouse.getCh();

    await ch.command({
      query: `
        ALTER TABLE Events
        DELETE WHERE workspaceId = {workspaceId:UInt32}
        SETTINGS mutations_sync = 2
      `,
      query_params: {
        workspaceId: Number(workspaceId),
      },
    });

    return true;
  },

  async removeTestEvents() {
    const ch = Clickhouse.getCh();
    const currentDate = moment().utc();
    const fortyEightHoursAgo = currentDate.subtract(2, "days").format("YYYY-MM-DD HH:mm:ss"); // Calculate 48 hours ago

    const fetchQuery = `
			INSERT INTO Events (id, workspaceId, userId, name, actions, avatar, content, type, muted, test, notify, searchable, contextId, contextType, createdAt, errors, category, version)
SELECT id, workspaceId, userId, name, [], '', '', type, muted, test, notify, '', contextId, contextType, createdAt, '', category, version + 1
FROM Events 
      WHERE test = 1 AND createdAt > '${fortyEightHoursAgo}';
		`;

    const resultSet = await ch.query({
      query: fetchQuery,
      format: "JSONEachRow",
    });

    const results = await resultSet.json();
  },

  async getStats() {
    const ch = Clickhouse.getCh();
    const query = `
    SELECT 
    database, 
    table, 
    formatReadableSize(sum(bytes)) AS total_size
FROM system.parts
WHERE active = 1
GROUP BY database, table
ORDER BY total_size DESC;
  `;

    try {
      const resultSet = await ch.query({
        query: query,
        format: "JSONEachRow",
      });

      const results = await resultSet.json();

      return results;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getStatData(schema, workspaceId) {
    const ch = Clickhouse.getCh();

    const days = schema.date === "7 days" ? 7 : schema.date === "30 days" ? 30 : 60;

    // CH-friendly strings: "YYYY-MM-DD HH:mm:ss.SSS" (UTC)
    const start = moment
      .utc()
      .startOf("day")
      .subtract(days - 1, "days")
      .format("YYYY-MM-DD HH:mm:ss.SSS");
    const end = moment.utc().startOf("day").add(1, "day").format("YYYY-MM-DD HH:mm:ss.SSS");

    // match against Events.name (event) or Events.category (category)
    const field = schema.type === "category" ? "category" : "name";
    const agg = (schema.aggregate || "TOTAL").toUpperCase();

    const qp = {
      title: String(schema.title || ""),
      ws: Number(workspaceId),
      start,
      end,
    };

    if (agg === "TOTAL") {
      const query = `
      SELECT toUInt64(count()) AS value
      FROM Events
      WHERE ${field} = {title:String}
        AND workspaceId = {ws:UInt32}
        AND createdAt >= toDateTime64({start:String}, 3, 'UTC')
        AND createdAt <  toDateTime64({end:String},   3, 'UTC')
    `;
      const res = await ch.query({ query, format: "JSON", query_params: qp });
      const json = await res.json();
      return Number(json.data?.[0]?.value ?? 0);
    }

    const fn = agg === "MAX" ? "max" : "avg";
    const query = `
    SELECT ifNull(${fn}(c), 0) AS value
    FROM (
      SELECT toDate(createdAt) AS d, count() AS c
      FROM Events
      WHERE ${field} = {title:String}
        AND workspaceId = {ws:UInt32}
        AND createdAt >= toDateTime64({start:String}, 3, 'UTC')
        AND createdAt <  toDateTime64({end:String},   3, 'UTC')
      GROUP BY d
    )
  `;
    const res = await ch.query({ query, format: "JSON", query_params: qp });
    const json = await res.json();
    return Number(json.data?.[0]?.value ?? 0);
  },

  async getLineData(schema, workspaceId) {
    const ch = Clickhouse.getCh();

    // 1) window (7|30|60 days) and ClickHouse-friendly bounds
    let days = schema.date === "7 days" ? 7 : schema.date === "30 days" ? 30 : 60;
    if (schema.date === "1 year") {
      days = 365;
    }
    const startDT = moment
      .utc()
      .startOf("day")
      .subtract(days - 1, "days");
    const endDT = moment.utc().startOf("day").add(1, "day");
    const start = startDT.format("YYYY-MM-DD HH:mm:ss.SSS");
    const end = endDT.format("YYYY-MM-DD HH:mm:ss.SSS");

    // Precompute ISO bucket labels (exactly N days)
    const buckets = [];
    for (let i = 0; i < days; i++) {
      buckets.push(startDT.clone().add(i, "days").toISOString()); // "YYYY-MM-DDTHH:mm:ss.SSSZ"
    }

    const sels = Array.isArray(schema.dataSelectors) ? schema.dataSelectors : [];
    const results = [];

    for (let i = 0; i < sels.length; i++) {
      const s = sels[i] || {};
      const field = s.selector === "category" ? "category" : "name"; // "event" -> name
      const paramName = "val" + i;

      const qp = {
        ws: Number(workspaceId),
        start,
        end,
      };
      qp[paramName] = String(s.text || "");

      const whereSql =
        "workspaceId = {ws:UInt32} " +
        "AND createdAt >= toDateTime64({start:String}, 3, 'UTC') " +
        "AND createdAt <  toDateTime64({end:String},   3, 'UTC') " +
        `AND ${field} = {${paramName}:String}`;

      // Return day buckets as ISO-8601 straight from ClickHouse
      const query = `
      SELECT
        concat(formatDateTime(toStartOfDay(createdAt), '%FT%T', 'UTC'), '.000Z') AS x,
        count() AS y
      FROM Events
      WHERE ${whereSql}
      GROUP BY x
      ORDER BY x
    `;

      const res = await ch.query({ query, format: "JSON", query_params: qp });
      const json = await res.json();
      const rows = Array.isArray(json.data) ? json.data : [];

      // Map for quick lookup (x -> y)
      const map = Object.create(null);
      for (let j = 0; j < rows.length; j++) {
        map[rows[j].x] = Number(rows[j].y) || 0;
      }

      // Zero-fill to full window
      const series = buckets.map((x) => ({ x, y: map[x] ?? 0 }));

      // Attach the selector metadata to this result
      results.push({
        text: s.text ?? "",
        selector: s.selector ?? "event",
        aggregate: s.aggregate ?? "CUMULATIVE",
        data: series,
      });
    }

    return results;
  },
};

export default clickhouse;
