import WorkspaceModel from "#components/workspace/model.js";
import InvoiceModel from "#components/invoice/model.js";
import Events from "#components/events/index.js";

import config from "#lib/config.js";

import moment from "moment";
import Stripe from "stripe";

class Billing {
	stripe = null;
	options = {
		utcOffset: 0,
	};

	async setup() {
		let key = config.stripe.TEST_SECRET;
		if (process.env.NODE_ENV === "production") {
			key = config.stripe.LIVE_SECRET;
		}
		this.stripe = Stripe(key);
	}

	async billInvoices() {
		let invoices = await InvoiceModel.client.findMany({
			where: {
				status: "OPEN",
			},
			include: {
				workspace: true,
			},
		});

		for (let i = 0; i < invoices.length; i++) {
			let invoice = invoices[i];

			await this.billInvoice(invoice);
		}
	}

	async billInvoice(invoice) {
		// In this case, mark the invoice as void because there's no point passing 0 in stripe's paymentIntent api.
		// For the latter, stripe won't accept a payment of $0.5 or lower
		if (invoice.total <= 0.5) {
			await InvoiceModel.client.update({
				where: {
					id: invoice.id,
				},
				data: {
					status: "VOID",
				},
			});
			return;
		}

		// Payment has been successful, log this(this shouldn't happen)
		if (invoice.paymentStatus && invoice.paymentStatus === "succeeded") {
			return;
		}

		// Payment has been process, check paymentIntent via the paymentIntentId;
		if (invoice.paymentStatus && invoice.paymentStatus === "processing") {
			let paymentIntent = await this.stripe.paymentIntents
				.retrieve(invoice.paymentIntentId)
				.catch((err) => {
					console.log(err);
					// log this error
					throw err;
				});

			// payment was successful
			if (paymentIntent && paymentIntent.status === "succeeded") {
				await InvoiceModel.client
					.update({
						where: {
							id: invoice.id,
						},
						data: {
							status: "PAID",
						},
					})
					.catch((err) => {
						// log this error
						throw err;
					});
			}

			return;
		}

		// log if payment is in any other state
		let customerId = `cus_QHJmGtWfUi83L5`;
		const paymentMethods =
			await this.stripe.customers.listPaymentMethods(customerId);

		if (!paymentMethods) {
			this.onNoPaymentMethod(invoice);
			return;
		}

		const paymentMethod = paymentMethods.data[0];

		if (!paymentMethod) {
			this.onNoPaymentMethod(invoice);
			return;
		}

		const paymentMethodId = paymentMethod.id;

		let status = null;
		let paymentIntent = null;

		try {
			paymentIntent = await this.chargeCustomer(
				customerId,
				paymentMethodId,
				invoice.total,
			).catch((err) => {
				console.log(err);
			});

			status = paymentIntent.status;
		} catch (err) {
			// log this error
			throw err;
		}

		console.log(paymentIntent);

		if (!status) {
			return;
		}

		let data = {
			paymentIntentId: paymentIntent.id,
			paymentStatus: status,
		};

		if (status === "succeeded") {
			data.status = "PAID";
		}

		invoice = await InvoiceModel.client.update({
			where: {
				id: invoice.id,
			},
			data,
		});

		console.log(invoice);

		console.log(`------`);
	}

	async createCustomer(user, workspaceId) {
		const email = user.email;
		const name = `${user.firstName} ${user.lastName}`;
		const customer = await this.stripe.customers.create({
			email,
			name,
		});

		console.log("customer created");

		await WorkspaceModel.update({
			id: workspaceId,
			customerId: customer.id,
		}).catch((err) => {
			console.log(err);
		});

		return customer;
	}

	/**
	 * This bad boi runs when someone doesn't have a valid paymentMethod but we must charge them
	 * Probably flip their workspace status
	 */
	async onNoPaymentMethod(invoice) {}

	async chargeCustomer(customerId, paymentMethodId, amount) {
		const currency = "usd";

		try {
			// Retrieve customer's default payment method
			//const customer = await this.stripe.customers.retrieve(customerId);
			//const paymentMethod = customer.invoice_settings.default_payment_method;

			// Create a Payment Intent
			const paymentIntent = await this.stripe.paymentIntents.create({
				amount: amount * 100, // Amount must be in cents
				currency: currency,
				customer: customerId,
				payment_method: paymentMethodId,
				confirm: true,
				automatic_payment_methods: {
					enabled: true,
					allow_redirects: "never",
				},
			});

			// Optionally, handle the payment intent confirmation
			console.log("Payment Intent created:", paymentIntent);

			// Return the payment intent status or details as needed
			return paymentIntent;
		} catch (error) {
			// Handle errors
			console.error("Error charging customer:", error);
			throw error;
		}
	}

	async getSetupIntents(customerId) {
		console.log(config.stripe);
		try {
			const setupIntents = await this.stripe.setupIntents.list({
				limit: 99,
				customer: customerId,
			});
			return setupIntents;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	// Cancels all setupIntents of a customer
	async cancelSetupIntents(customerId) {
		try {
			const setupIntents = await this.stripe.setupIntents.list({
				limit: 99,
				customer: customerId,
			});
			console.log(setupIntents.data);
			if (!setupIntents) {
				return null;
			}
			if (!setupIntents.data) {
				return [];
			}
			for (let i = 0; i < setupIntents.data.length; i++) {
				const setupIntent = setupIntents.data[0];

				await this.stripe.setupIntents.cancel(setupIntent.id).catch((err) => {
					console.log(err);
				});
			}
			console.log(`${setupIntents.data.length} SetupIntents cancelled`);
			return setupIntents;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async getPaymentMethods(customerId) {
		try {
			const paymentMethods = await this.stripe.customers.listPaymentMethods(
				customerId,
				{
					limit: 99,
				},
			);
			return paymentMethods;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}

export default new Billing();
