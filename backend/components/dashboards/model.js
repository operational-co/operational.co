import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";
import Db from "#services/db/index.js";
import NodeCache from "node-cache";

const widgetCache = new NodeCache({ stdTTL: 60, checkperiod: 30, useClones: false, maxKeys: 1000 });

class Dashboard extends Model {
  // Get one dashboard for a workspace (default/first)
  async findLatest(workspaceId) {
    return prisma.dashboard.findFirst({
      where: { workspaceId },
      orderBy: { id: "asc" },
    });
  }

  // Fetch widgets for a dashboard and attach fresh data for each
  async getWidgetsWithData({ dashboardId }) {
    const dash = await prisma.dashboard.findUnique({
      where: { id: Number(dashboardId) },
      select: { id: true, workspaceId: true },
    });
    if (!dash) throw new Error("Dashboard not found");

    const widgets = await this._rawWidgets(dashboardId);
    const results = [];

    for (let i = 0; i < widgets.length; i++) {
      const w = widgets[i];

      const data = await this.getSingleWidgetData(w, dash.workspaceId);

      results.push({ ...w, data });
    }

    return { dashboardId: dash.id, widgets: results };
  }

  async getSingleWidgetData(w, workspaceId) {
    // use widget's own schema.date as the range key (e.g., "7 days")
    const rangeKey = w.schema && w.schema.date ? String(w.schema.date) : "default-range";
    const cacheKey = this._cacheKey(w, workspaceId, rangeKey);

    let data = widgetCache.get(cacheKey);
    if (data === undefined) {
      if (w.type === "STAT") {
        data = await Db.getStatData(w.schema, workspaceId);
      } else if (w.type === "LINE") {
        data = await Db.getLineData(w.schema, workspaceId);
      } else if (w.type === "ACTION") {
        data = {};
      } else {
        data = null;
      }
      widgetCache.set(cacheKey, data);
    }

    return data;
  }

  _cacheKey(widget, workspaceId, rangeKey) {
    // include schema string to differentiate different selector sets
    const schemaStr = JSON.stringify(widget.schema || {});
    return [
      "ws",
      workspaceId,
      "wid",
      widget.id,
      "type",
      widget.type,
      "range",
      rangeKey,
      "schema",
      schemaStr,
    ].join("|");
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
    }));
  }
}

export default new Dashboard("dashboard", prisma);
