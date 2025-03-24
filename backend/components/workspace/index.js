import WorkspaceModel from "./model.js";
import UserModel from "#components/user/model.js";
import Workspace from "#components/workspace/model.js";
import Events from "#components/events/index.js";
import Invoice from "#components/invoice/index.js";
import Metric from "#components/metric/index.js";
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

import moment from "moment";

const component = {
	async activate(form) {
		let code = form.code;
		let users = await UserModel.client.findMany({
			where: {
				activationCode: code,
			},
		});

		if (!users) {
			throw "Invalid code";
		}

		if (users.length === 0) {
			throw "Invalid code";
		}

		const user = users[0];

		const newUser = await UserModel.client.update({
			where: {
				id: user.id,
			},
			data: {
				activated: true,
				activationCode: null,
				onboardingStep: "intro",
			},
		});

		return newUser;
	},

	async update(form) {
		let workspace = await Workspace.update(form);

		return workspace;
	},

	async create(form) {
		let workspace = await Workspace.client.create({
			data: {
				name: form.name,
				status: "NORMAL",
			},
		});
		let workspaceUser = await prisma.workspaceUser.create({
			data: {
				role: "ADMIN",
				userId: form.userId,
				workspaceId: workspace.id,
				notify: true,
			},
		});

		// then generate api key
		const apikey = await Key.generate(
			workspace.id,
			"Default key - created on signup",
		).catch((err) => {
			// log something here
		});

		let sessions = await SessionModel.client.findMany({
			where: {
				userId: form.userId,
			},
		});

		for (let i = 0; i < sessions.length; i++) {
			let session = sessions[i];
			await Session.invalidate(session.sid);
		}

		const user = await prisma.User.update({
			where: {
				id: form.userId,
			},
			data: {
				primaryWorkspace: workspace.id,
			},
		});

		let session = await Session.generate(user);

		const jwt = generateJwt(session.sid);

		await Key.buildCache();

		// then email user
		await Email.onNewWorkspace(form.userId, workspace);

		return jwt;
	},

	/**
	 * Generates a cache of event names for all workspaces
	 */
	async generateEventNames() {
		let workspaces = await WorkspaceModel.client.findMany({
			where: {},
		});

		for (let i = 0; i < workspaces.length; i++) {
			let workspace = workspaces[i];

			let eventNames = await Events.generateCommonEventNames(workspace.id);

			if (eventNames.length > 0) {
				await WorkspaceModel.update({
					id: workspace.id,
					eventNames,
				}).catch((err) => {
					console.log(err);
				});
			}
		}
	},

	/**
	 * Create an invoice
	 * - Check if first invoice, and if yes, has it gone over 10,000
	 * - If no, return
	 * - If yes, continue
	 * - Generate invoice period
	 * - Generate event quantity
	 * - Attach the workspaceId
	 * - Attach the current prices
	 * - Attach current events
	 * - Attach the total price
	 * - Set status to open
	 */
	async createWorkspaceInvoice(workspace) {
		let invoices = workspace.invoices || [];

		if (!invoices[0]) {
			// check current events
		}

		let len = invoices.length + 1;

		let eventQuantity = 27000;

		const paddedNumber = String(len).padStart(4, "0");

		let code = `INV-${workspace.id}-${paddedNumber}`;

		let { periodStart, periodEnd } = await Invoice.calculateBillingPeriod(
			workspace.invoices,
		);

		let cost = 199.0;

		let subTotal = 199.0;

		let total = 199.0;

		let lineItems = [
			{
				description: `Operational events(${eventQuantity} events logged), ${periodStart} - ${periodEnd}`,
				amount: `$${cost}`,
			},
		];

		let invoice = {
			code,
			lineItems,
			subTotal,
			total,
			periodStart,
			periodEnd,
			workspaceId: workspace.id,
			status: "OPEN",
		};

		invoice = await InvoiceModel.client
			.create({
				data: invoice,
			})
			.catch((err) => {
				console.log(err);
			});
	},

	async billUsers() {
		// don't run if selfhosted
		if (config.SELFHOSTED) {
			return;
		}
		// first, get workspaces
		let workspaces = await WorkspaceModel.client.findMany({
			where: {
				status: "NORMAL",
			},
			include: {
				invoices: true,
				coupons: true,
			},
		});

		/**
		 * Check for recurring billing
		 */
		for (let i = 0; i < workspaces.length; i++) {
			let workspace = workspaces[i];

			await Invoice.generateInvoice(workspace);
		}

		/**
		 * Then bill invoices
		 */
		await Billing.billInvoices();
	},

	async generateCategories() {
		let workspaces = await WorkspaceModel.client.findMany({
			where: {
				status: {
					in: ["NORMAL", "DEMO"],
				},
			},
		});

		for (let i = 0; i < workspaces.length; i++) {
			let workspaceId = workspaces[i].id;
			workspaceId = workspaceId + "";
			await Events.computeCategories(workspaceId);
		}
	},

	async calculateMetrics() {
		const workspaces = await prisma.workspace.findMany({
			where: {
				status: {
					in: ["NORMAL", "DEMO"],
				},
			},
		});

		for (let i = 0; i < workspaces.length; i++) {
			const workspace = workspaces[i];

			const metric = await Metric.calculateMetric(workspace.id);
		}
	},

	async deactivateWorkspaces() {
		const workspaces = await prisma.workspace.findMany({
			where: {
				usedFreeEvents: {
					gt: prisma.workspace.fields.freeEvents,
				},
				status: {
					in: ["NORMAL"],
				},
			},
		});

		for (let i = 0; i < workspaces.length; i++) {
			const workspace = workspaces[i];

			await this.toDeactivate(workspace.id);
		}
	},

	async toDeactivate(workspaceId) {
		let data = {
			id: workspaceId,
			status: "DEACTIVATED",
			holdAt: null,
		};

		const workspace = await WorkspaceModel.update(data);

		await Billing.cancelSetupIntents(workspace.customerId);

		await Email.onWorkspaceDeactivated(workspace);
	},

	async sendLifecycleEmails() {
		const workspaces = await prisma.workspace.findMany({
			where: {
				status: {
					in: ["NORMAL"],
				},
				holdAt: {
					not: null,
				},
			},
		});

		for (let i = 0; i < workspaces.length; i++) {
			const workspace = workspaces[i];

			const emailFlags = workspace.emailFlags || {};

			if (!emailFlags.informEventsAt) {
				await Email.onWorkspaceInformEvents(workspace);

				emailFlags.informEventsAt = moment.utc().toISOString();

				await WorkspaceModel.update({
					id: workspace.id,
					emailFlags,
				});
			}
		}
	},

	async calculateUsedFreeEvents() {
		const workspaces = await prisma.workspace.findMany({
			where: {
				usedFreeEvents: {
					lt: prisma.workspace.fields.freeEvents,
				},
			},
		});

		for (let i = 0; i < workspaces.length; i++) {
			const workspace = workspaces[i];

			// get all metrics for said workspace
			const metrics = await Metric.getAllMetrics(workspace.id);

			let totalEvents = 0;

			for (let j = 0; j < metrics.length; j++) {
				const metric = metrics[j];

				totalEvents = totalEvents + metric.events;
			}

			if (totalEvents > 0) {
				const payload = {
					id: workspace.id,
					usedFreeEvents: totalEvents,
				};

				const updatedWorkspace = await WorkspaceModel.update(payload);

				// Only nag if payment details aren't entered
				if (!workspace.paymentStartedAt) {
					await this.nagWorkspace(updatedWorkspace);
				}
			}
		}

		await this.deactivateWorkspaces();
	},

	async nagWorkspace(workspace) {
		console.log(`Nagging ${workspace.name}`);
		const emailFlags = workspace.emailFlags || {};

		let percentageDifference =
			((workspace.freeEvents - workspace.usedFreeEvents) /
				workspace.freeEvents) *
			100;

		percentageDifference = 100 - percentageDifference;

		percentageDifference = Math.ceil(percentageDifference);

		console.log(percentageDifference);

		if (percentageDifference >= 50 && !emailFlags.nag50) {
			// nag for 50%
			await Email.sendNagEmail(workspace, 50);
			emailFlags.nag50 = true;
			let payload = {
				id: workspace.id,
				emailFlags,
			};
			await WorkspaceModel.update(payload);
		}

		if (percentageDifference > 75 && !emailFlags.nag75) {
			// nag for 75%
			await Email.sendNagEmail(workspace, 75);
			emailFlags.nag75 = true;
			let payload = {
				id: workspace.id,
				emailFlags,
			};
			await WorkspaceModel.update(payload);
		}

		if (percentageDifference > 95 && !emailFlags.nag95) {
			// nag for 95%
			await Email.sendNagEmail(workspace, 95);
			emailFlags.nag95 = true;
			let payload = {
				id: workspace.id,
				emailFlags,
			};
			await WorkspaceModel.update(payload);
		}
	},
};

export default component;
