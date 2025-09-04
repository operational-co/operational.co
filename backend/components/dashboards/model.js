import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";
import Db from "#services/db/index.js";

class Dashboard extends Model {
  // Get one dashboard for a workspace (default/first)
  async findLatest(workspaceId) {
    return prisma.dashboard.findFirst({
      where: { workspaceId },
      orderBy: { id: "asc" },
    });
  }

  // Fetch widgets for a dashboard and attach fresh data for each
  async getWidgetsWithData({ dashboardId, start, end }) {
    const dash = await prisma.dashboard.findUnique({
      where: { id: Number(dashboardId) },
      select: { id: true, workspaceId: true },
    });
    if (!dash) throw new Error("Dashboard not found");

    const widgets = await this._rawWidgets(dashboardId); // raw read
    const results = [];
    for (const w of widgets) {
      let data = null;
      if (w.type === "STAT") {
        data = await Db.getStatData(w.schema, dash.workspaceId);
      } else {
        data = await this._computeInternalCount({
          widget: w,
          workspaceId: dash.workspaceId,
          start,
          end,
        });
      }
      results.push({
        ...w,
        data,
      });
    }
    return { dashboardId: dash.id, widgets: results };
  }

  // ---- PRIVATE -------------------------------------------------------------

  // Raw: load widgets (id, type, groupBy, selectors JSON) for the dashboard
  async _rawWidgets(dashboardId) {
    // NOTE: `selectors` comes back as string in some drivers—parse safely below
    const rows = await prisma.$queryRawUnsafe(
      "SELECT `id`, `type`,  `x`, `y`, `w`, `h`, `schema` FROM `Widget` WHERE `dashboardId` = ? ORDER BY `id` ASC",
      Number(dashboardId),
    );
    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      x: r.x,
      y: r.y,
      w: r.w,
      h: r.h,
      schema: r.schema,
      selectors: this._parseSelectors(r.selectors),
    }));
  }

  _parseSelectors(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // COUNT(*) over Events between start/end, optional groupBy(category|name)
  async _computeInternalCount({ widget, workspaceId, start, end }) {
    const grain = this._pickGrain(start, end);
    const bucket = this._bucketExpr(grain);
    const { sql: whereSql, params } = this._buildWhereEq(widget.selectors);

    const grouped = widget.groupBy === "CATEGORY" || widget.groupBy === "NAME";
    const groupCol = grouped ? (widget.groupBy === "CATEGORY" ? "`category`" : "`name`") : null;
    const groupSel = groupCol ? `, ${groupCol} AS seriesKey` : "";
    const groupBy = groupCol ? `, ${groupCol}` : "";

    const sql = `
      SELECT ${bucket} AS bucket, (COUNT(*) + 0.0)  AS value ${groupSel}
      FROM \`Events\`
      WHERE (${whereSql})
        AND \`workspaceId\` = ?
        AND \`createdAt\` >= ? AND \`createdAt\` < DATE_ADD(?, INTERVAL 1 ${
          grain === "month" ? "MONTH" : "DAY"
        })
      GROUP BY bucket ${groupBy}
      ORDER BY bucket ASC
    `;

    const rows = await prisma.$queryRawUnsafe(
      sql,
      ...params,
      Number(workspaceId),
      new Date(start),
      new Date(end),
    );

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      row.value = parseInt(row.value);

      rows[i] = row;
    }

    const buckets = this._genBuckets(start, end, grain);

    function keyOf(d, grain) {
      let dt = new Date(d); // d is a Date from MySQL
      if (grain === "month") {
        // first day of that month, UTC
        return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1)).toISOString();
      } else {
        // that day at 00:00:00 UTC
        return new Date(
          Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()),
        ).toISOString();
      }
    }

    if (!grouped) {
      const map = new Map(rows.map((r) => [keyOf(r.bucket, grain), Number(r.value)]));
      return buckets.map((y) => ({ y, x: map.get(y) ?? 0 }));
    }

    const seriesMap = new Map();
    for (const r of rows) {
      const key = r.seriesKey ?? "default";
      if (!seriesMap.has(key)) seriesMap.set(key, new Map());
      seriesMap.get(key).set(keyOf(r.bucket, grain), Number(r.value));
    }

    let datas = [];
    seriesMap.forEach(function (map, key) {
      let points = [];
      for (let i = 0; i < buckets.length; i++) {
        let x = buckets[i];
        let y = map.get(x) != null ? map.get(x) : 0;
        points.push({ x: x, y: y });
      }
      datas.push({ key: key, data: points });
    });

    return datas;
  }

  // v1: only eq selectors; allowlist fields to avoid typos/injection
  _buildWhereEq(selectors = []) {
    if (!selectors.length) return { sql: "1=1", params: [] };
    const ALLOWED = new Set(["name", "category", "contextType", "test", "userId"]);
    const parts = [];
    const params = [];
    for (const s of selectors) {
      if (!s || !ALLOWED.has(s.field)) continue;
      parts.push("`" + s.field + "` = ?");
      params.push(s.value);
    }
    return parts.length ? { sql: parts.join(" AND "), params } : { sql: "1=1", params: [] };
  }

  _pickGrain(start, end) {
    const ms = +new Date(end + "T00:00:00Z") - +new Date(start + "T00:00:00Z");
    const days = Math.ceil(ms / 86400000);
    return days <= 60 ? "day" : "month";
  }

  _bucketExpr(grain) {
    return grain === "month" ? "DATE_FORMAT(`createdAt`, '%Y-%m-01')" : "DATE(`createdAt`)";
  }

  // produce ISO buckets between start..end inclusive
  _genBuckets(start, end, grain) {
    var out = [];

    if (grain === "month") {
      var s = new Date(start + "T00:00:00Z");
      var e = new Date(end + "T00:00:00Z");
      var y = s.getUTCFullYear();
      var m = s.getUTCMonth();
      var endY = e.getUTCFullYear();
      var endM = e.getUTCMonth();

      for (;;) {
        out.push(new Date(Date.UTC(y, m, 1)).toISOString()); // ISO month bucket
        if (y === endY && m === endM) break;
        m++;
        if (m > 11) {
          m = 0;
          y++;
        }
      }
    } else {
      var s0 = new Date(start + "T00:00:00Z");
      var e0 = new Date(end + "T00:00:00Z");
      var t = Date.UTC(s0.getUTCFullYear(), s0.getUTCMonth(), s0.getUTCDate());
      var tz = Date.UTC(e0.getUTCFullYear(), e0.getUTCMonth(), e0.getUTCDate());
      var DAY = 86400000;

      for (; t <= tz; t += DAY) {
        out.push(new Date(t).toISOString()); // ISO day bucket
      }
    }

    return out;
  }
}

export default new Dashboard("dashboard", prisma);
