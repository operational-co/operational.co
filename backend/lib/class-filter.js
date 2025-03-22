/**
 * Base class Controller
 * Add methods in here to make them available across all services
 */
import config from "#lib/config.js";
import prisma from "#lib/prisma.js";
import perfectExpressSanitizer from "perfect-express-sanitizer";
import { format } from "sql-formatter";

/**
 * @constructor
 */
class Filter {
  constructor(tableName) {
    this.tableName = tableName;

    this.selectables = [];

    this.debug = false;

    this.format = format;
  }

  log(msg) {
    if (this.debug) {
      console.log(msg);
    }
  }

  async run(params) {
    //console.time('FILTER');

    this.log("FILTER STARTED");

    params = await this.cleanParams(params);

    let results = await this.getResults(params);

    results = await this.cleanResults(results);

    this.log("FILTER FINISHED");

    return results;
  }

  async cleanParams(params) {
    let skip = params.skip || 0;
    let take = params.take || 20;
    let query = params.query || "";

    let newParams = {
      skip,
      take,
      query,
    };

    return newParams;
  }

  async getResults(params) {
    const sql = await this.createSql(params);

    let results = await prisma.$queryRawUnsafe(sql).catch((err) => {
      console.log(err);
    });

    return results || [];
  }

  async createSql(params) {
    let tableName = this.tableName;
    let mode = `NATURAL LANGUAGE MODE`;

    let select = `
    SELECT
      b.id
    `;

    let where = `
    `;

    let orderBy = `
    `;

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

  async cleanResults(results) {
    for (let i = 0; i < results.length; i++) {}

    return results;
  }
}

export default Filter;
