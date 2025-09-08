import Dashboard from "./model.js";

import axios from "axios";
import moment from "moment";
import prisma from "#lib/prisma.js";

const component = {
  async find(params) {
    let dash = await Dashboard.findLatest(params.workspaceId);
    if (!dash) {
      // create a default dashboard
      dash = await Dashboard.client.create({
        data: {
          name: "Default",
          workspace: {
            connect: {
              id: params.workspaceId,
            },
          },
        },
      });
    }
    const payload = await Dashboard.getWidgetsWithData({
      dashboardId: dash.id,
    });

    if (payload && payload.widgets) {
      dash.widgets = payload.widgets;
    }

    return dash;
  },

  async createWidget(widget) {
    widget = await prisma.widget.create({
      data: widget,
    });

    console.log(widget);

    return widget;
  },

  async updateWidgets(payload) {
    const workspaceId = Number(payload.workspaceId);
    const dashboardId = Number(payload.dashboardId);
    const incoming = this._sanitizeWidgets(payload.widgets);

    await this._assertDashboardAccess(workspaceId, dashboardId);

    const allowedIds = await this._widgetIdsForDashboard(dashboardId);
    const toUpdate = [];
    for (let i = 0; i < incoming.length; i++) {
      const w = incoming[i];
      if (allowedIds.has(w.id)) toUpdate.push(w);
    }
    if (!toUpdate.length) return { updated: 0 };

    // transaction: one UPDATE per widget (simple and clear)
    await prisma.$transaction(
      toUpdate.map(function (w) {
        return prisma.widget.update({
          where: { id: w.id },
          data: { x: w.x, y: w.y },
        });
      }),
    );

    return { updated: toUpdate.length };
  },

  async _assertDashboardAccess(workspaceId, dashboardId) {
    const dash = await prisma.dashboard.findFirst({
      where: { id: dashboardId, workspaceId: workspaceId },
      select: { id: true },
    });
    if (!dash) throw new Error("Dashboard not found for this workspace");
  },

  async _widgetIdsForDashboard(dashboardId) {
    const rows = await prisma.widget.findMany({
      where: { dashboardId: dashboardId },
      select: { id: true },
    });
    const set = new Set();
    for (let i = 0; i < rows.length; i++) set.add(rows[i].id);
    return set;
  },

  _sanitizeWidgets(list) {
    const out = [];
    if (!Array.isArray(list)) return out;
    for (let i = 0; i < list.length; i++) {
      const w = list[i] || {};
      const id = Number(w.id);
      const x = Number(w.x);
      const y = Number(w.y);
      if (Number.isInteger(id) && Number.isFinite(x) && Number.isFinite(y)) {
        out.push({ id: id, x: x, y: y });
      }
    }
    return out;
  },

  async deleteWidget(form) {
    try {
      // Ensure the widget exists and belongs to the same workspace via its dashboard
      const existing = await prisma.widget.findFirst({
        where: {
          id: form.widgetId,
          dashboardId: form.dashboardId,
          dashboard: { workspaceId: form.workspaceId },
        },
        select: { id: true },
      });

      if (!existing) {
        throw `Widget not found`;
      }

      const deleted = await prisma.widget.delete({
        where: { id: existing.id },
      });

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export default component;
