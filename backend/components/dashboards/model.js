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
      }
      if (w.type === "LINE") {
        data = await Db.getLineData(w.schema, dash.workspaceId);
      }
      if (w.type === "ACTION") {
        data = {};
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
    }));
  }
}

export default new Dashboard("dashboard", prisma);
