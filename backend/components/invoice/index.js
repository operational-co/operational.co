import Pdf from "#services/pdf/index.js";
import Model from "./model.js";
import Events from "#components/events/index.js";
import config from "#lib/config.js";
import generateCost from "#lib/generate-cost.js";
import moment from "moment";

const component = {
	async calculateBillingPeriod(invoices) {
		let periodStart = null;
		let periodEnd = null;

		let currentDate = moment.utc();
		currentDate = currentDate.startOf("day");
		currentDate = currentDate.startOf("month");

		periodEnd = currentDate.format("YYYY-MM-DD HH:mm:ss");

		currentDate = currentDate.subtract(1, "month");

		// If invoices are present, get the start date from the periodEnd date of the latest invoice
		if (invoices && invoices.length > 0) {
			periodStart = invoices[invoices.length - 1].periodEnd;

			periodStart = moment(periodStart).utc();

			periodStart = periodStart.format("YYYY-MM-DD HH:mm:ss");
		} else {
			// Get invoices by subtracting 1 month

			periodStart = currentDate.format("YYYY-MM-DD HH:mm:ss");
		}

		return {
			periodStart,
			periodEnd,
		};
	},

	async generateInvoice(workspace) {
		try {
			let invoices = workspace.invoices || [];

			let { periodStart, periodEnd } =
				await this.calculateBillingPeriod(invoices);

			// rewrite this to use metrics
			let eventQuantity = await Events.getEventsCountPerBillingCycle(
				workspace.id,
				{
					periodStart,
					periodEnd,
				},
			);

			if (!invoices[0]) {
				// check current events
			}

			let costData = await generateCost(
				config.prices.eventScales,
				eventQuantity,
			);

			let cost = costData.cost;

			let total = cost;
			let subTotal = cost;

			let len = invoices.length + 1;

			const paddedNumber = String(len).padStart(4, "0");

			let code = `INV-${workspace.id}-${paddedNumber}`;

			let lineItems = [
				{
					description: `Operational events(${eventQuantity} events logged), ${periodStart} - ${periodEnd}`,
					amount: `$${cost}`,
				},
			];

			periodStart = moment(periodStart, "YYYY-MM-DD HH:mm:ss")
				.utc()
				.toISOString();
			periodEnd = moment(periodEnd, "YYYY-MM-DD HH:mm:ss").utc().toISOString();

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

			invoice = await Model.client
				.create({
					data: invoice,
				})
				.catch((err) => {
					console.log(err);
				});

			return invoice;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};

export default component;
