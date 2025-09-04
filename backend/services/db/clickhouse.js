import moment from "moment";
import config from "#lib/config.js";
import { performance } from "perf_hooks";
import Clickhouse from "#services/clickhouse/index.js";

const clickhouse = {
  async find(params) {
    const table = "Events";
    const ch = Clickhouse.getCh();
    const take = config.events.take;
    let where = [`workspaceId = '${params.workspaceId}'`, `contextType = 0`];

    if (params.test) {
      where.push(`test = 1`);
    } else {
      where.push(`test = 0`);
    }

    if (params.query && typeof params.query === "string") {
      let q = params.query.toLowerCase();
      where.push(`lowerUTF8(searchable) LIKE '%${q}%'`);
    }

    if (params.category) {
      where.push(`category = '${params.category}'`);
    }

    if (params.cursor) {
      let initialEvent = await this.findOne(params.cursor, params.test);
      let clause = `(createdAt < '${initialEvent.createdAt}')`;
      where.push(clause);
    }

    where = `WHERE ${where.join(" AND ")}`;

    let query = `SELECT DISTINCT ON (id) * FROM ${table} ${where} ORDER BY createdAt DESC LIMIT ${take}`;

    const resultSet = await ch.query({
      query: query,
      format: "JSONEachRow",
    });

    // const explainSet = await ch.query({
    // 	query: `EXPLAIN ${query}`,
    // 	format: "JSON",
    // });

    // const explainResults = await explainSet.json();

    const results = await resultSet.json();

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

  async findLatest(params) {
    const table = "Events";
    const ch = Clickhouse.getCh();
    const take = config.events.take;
    let where = [`workspaceId = '${params.workspaceId}'`, `contextType = 0`];

    if (params.test) {
      where.push(`test = 1`);
    } else {
      where.push(`test = 0`);
    }

    if (params.query && typeof params.query === "string") {
      let q = params.query.toLowerCase();
      where.push(`lowerUTF8(searchable) LIKE '%${q}%'`);
    }

    if (params.category) {
      where.push(`category = '${params.category}'`);
    }

    if (params.cursor) {
      let initialEvent = await this.findOne(params.cursor);

      if (initialEvent) {
        let clause = `(createdAt > '${initialEvent.createdAt}')`;
        where.push(clause);
      } else {
        console.log(params.cursor);
      }
    }

    where = `WHERE ${where.join(" AND ")}`;

    let query = `SELECT DISTINCT ON (id) * FROM ${table} ${where} ORDER BY createdAt ASC LIMIT ${take}`;

    const resultSet = await ch.query({
      query: query,
      format: "JSONEachRow",
    });

    const results = await resultSet.json();

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
    let take = 100;

    let contexts = params.contexts.map((ctx) => {
      return `'${ctx}'`;
    });

    let contextIds = `contextId IN (${contexts.join(",")})`;

    let where = [`workspaceId = '${params.workspaceId}'`, `contextType = 1`, contextIds];

    where = `WHERE ${where.join(" AND ")}`;

    let query = `SELECT DISTINCT ON (id) * FROM Events ${where} ORDER BY createdAt ASC LIMIT ${take}`;

    const resultSet = await ch.query({
      query: query,
      format: "JSONEachRow",
    });

    const results = await resultSet.json();

    return results;
  },

  async findOne(id, testMode = false) {
    const ch = Clickhouse.getCh();
    let query = `SELECT * FROM Events WHERE id = '${id}'`;
    const resultSet = await ch.query({
      query: query,
      format: "JSONEachRow",
    });

    const dataset = await resultSet.json();

    if (dataset[0]) {
      return dataset[0];
    } else {
      return null;
    }
  },

  async updateOne(payload, testMode = false) {
    const ch = Clickhouse.getCh();
    if (payload._id) {
      delete payload._id;
    }

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
    const days = schema.date === "7 days" ? 7 : schema.date === "30 days" ? 30 : 60;
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
    let results = [];

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
      const m = {};
      for (let j = 0; j < rows.length; j++) {
        const r = rows[j];
        m[r.x] = parseInt(r.y, 10);
      }

      // Zero-fill to full window (use our prebuilt buckets)
      const series = [];
      for (let d = 0; d < buckets.length; d++) {
        const x = buckets[d];
        const y = m[x] != null ? m[x] : 0;
        series.push({ x: x, y: y });
      }

      results.push(series);
    }

    // formatting results
    results = results.map((res) => {
      return {
        data: res,
      };
    });

    return results;
  },
};

export default clickhouse;
