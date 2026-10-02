/**
 * Events db layer. We're using mysql for events storage for now
 */

import clickhouse from "./clickhouse.js";
import mysql from "./mysql.js";
import config from "#lib/config.js";

class Db {
  dbName = config.EVENT_STORE;

  constructor() {}

  async setup() {
    // const stats = await this.getStats();
    // console.log(stats);
  }

  async test() {
    return {
      name: "db",
      value: this.dbName,
      status: "active",
    };
  }

  cleanParams(params) {
    params = params || {};

    let skip = Number.parseInt(params.skip, 10);
    if (!Number.isInteger(skip) || skip < 0) {
      skip = 0;
    }

    let take = Number.parseInt(params.take, 10);
    if (!Number.isInteger(take) || take < 1) {
      take = config.events.take;
    }
    take = Math.min(take, 101);

    let mentions = params.mentions;
    if (!Array.isArray(mentions)) {
      mentions = mentions == null || mentions === "" ? [] : [mentions];
    }
    mentions = mentions
      .map((item) => String(item || "").trim())
      .filter((item, index, items) => item && items.indexOf(item) === index);

    const toBoolean = function (value, fallback = false) {
      if (value === true || value === "true" || value === 1 || value === "1") {
        return true;
      }
      if (value === false || value === "false" || value === 0 || value === "0") {
        return false;
      }
      return fallback;
    };

    let newParams = {
      skip,
      take,
      query: String(params.query || "").trim().slice(0, 1000),
      category: String(params.category || "").trim().slice(0, 191),
      test: toBoolean(params.test),
      workspaceId: Number(params.workspaceId),
      cursor: params.cursor || undefined,
      mentions,
      muted: toBoolean(params.muted),
      contextId: String(params.contextId || "").trim().slice(0, 191),
      hasContextStart: Object.prototype.hasOwnProperty.call(params, "contextStart"),
      contextStart: toBoolean(params.contextStart),
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

  async findOne(id, testMode = false, workspaceId) {
    const db = this.getDbInstance();
    return await db.findOne(id, testMode, workspaceId);
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

  async removeOldEvents() {
    // dont run if not in selfhosted mode
    if (!config.SELFHOSTED) {
      return;
    }
    const db = this.getDbInstance();
    return await db.removeOldEvents();
  }

  async removeWorkspaceEvents(workspaceId) {
    const db = this.getDbInstance();
    return await db.removeWorkspaceEvents(workspaceId);
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

  async getStatData(schema, workspaceId) {
    const db = this.getDbInstance();
    const stat = await db.getStatData(schema, workspaceId);
    return stat;
  }

  async getLineData(schema, workspaceId) {
    const db = this.getDbInstance();
    const stat = await db.getLineData(schema, workspaceId);
    return stat;
  }
}

export default new Db();
