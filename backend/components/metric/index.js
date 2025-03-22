import MetricModel from "./model.js";
import UserModel from "#components/user/model.js";
import Workspace from "#components/workspace/model.js";
import Events from "#components/events/index.js";
import Invoice from "#components/invoice/index.js";
import InvoiceModel from "#components/invoice/model.js";
import SessionModel from "#models/session.js";

import prisma from "#lib/prisma.js";
import isBanned from "#lib/is-banned.js";
import config from "#lib/config.js";
import generateCost from "#lib/generate-cost.js";
import generateJwt from "#lib/generate-jwt.js";

import Pdf from "#services/pdf/index.js";
import Key from "#services/key/index.js";
import Email from "#services/email/index.js";
import Billing from "#services/billing/index.js";
import Session from "#services/session/index.js";
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

		let endDate = utcTime
			.add(1, "M")
			.startOf("month")
			.format("YYYY-MM-DD HH:mm:ss");

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
			metric = await MetricModel.create(
				workspaceId,
				currentMonth,
				currentYear,
				events,
			);
		}

		return metric;
	},

	async getAllMetrics(workspaceId) {
		return await MetricModel.findByWorkspaceId(workspaceId);
	},

	async get(workspaceId) {
		return await this.getAllMetrics(workspaceId);
	},
};

export default component;
