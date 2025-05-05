import MetricModel from "./model.js";
import Db from "#services/db/index.js";

import moment from "moment";

const component = {
  async calculateMetric(workspaceId, month) {
    // first, get the metric for this month
    const utcTime = moment.utc();

    // months start from 1 (1 = january)
    let currentMonth = null;
    if (!month) {
      currentMonth = utcTime.month() + 1;
    } else {
      currentMonth = month;
    }
    const currentYear = utcTime.year();

    let startDate = utcTime.startOf("month").format("YYYY-MM-DD HH:mm:ss");
    //startDate = startDate.replace("Z", "");

    let endDate = utcTime.add(1, "M").startOf("month").format("YYYY-MM-DD HH:mm:ss");

    const payload = {
      workspaceId,
      startDate,
      endDate,
      test: false,
    };

    const count = await Db.getEventCount(payload);

    let metric = await MetricModel.findByMonth(workspaceId, currentMonth);

    if (metric) {
      metric = await MetricModel.update({
        id: metric.id,
        events: count,
      });
    } else {
      const events = count;
      metric = await MetricModel.create(workspaceId, currentMonth, currentYear, events);
    }

    return metric;
  },

  async getAllMetrics(workspaceId) {
    return await MetricModel.findByWorkspaceId(workspaceId);
  },

  async get(workspaceId) {
    return await this.getAllMetrics(workspaceId);
  },

  async getByWorkspaceMonthYear(workspaceId, month, year) {
    return await MetricModel.findByWorkspaceMonthYear(workspaceId, month, year);
  },
};

export default component;
