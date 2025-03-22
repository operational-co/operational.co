/**
 * This file will assume a health saas business of 5k usd MRR
 * It assumes:
 * - A $50 p/m subscription prices
 * - 1% conversion ratio
 * - 50 signups every day
 * - 100 existing customers
 */

import { faker } from "@faker-js/faker";

import Operational from "@operational.co/sdk";

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef", 8);

/**
 * User generator
 */
function generateUser(opts = {}) {
	let id = faker.string.uuid();
	let name = faker.person.fullName();
	let email = faker.internet.email();
	let companyName = faker.company.name();
	let ip = faker.internet.ipv4();

	let paid = opts.paid || false;

	let user = {
		id,
		name,
		email,
		companyName,
		ip,
		paid,
	};

	return user;
}

class Saas {
	users = [];
	apiKey;
	ops;
	test = false;

	constructor() {
		let token = "";
		let baseUrl = `http://0.0.0.0:2000`;

		let ops = new Operational(`${token}`, {
			baseUrl,
		});

		this.ops = ops;

		// let user = {
		//   userId: 1,
		//   firstName: "Shash",
		//   lastName: "Amin",
		//   email: "shashwat.amin@yahoo.com",
		// };

		// this.ops.users.identify(user);

		let userLen = 100;
		for (let i = 0; i < userLen; i++) {
			let user = generateUser({
				paid: true,
			});
			this.users.push(user);
		}

		this.apiKey = `gen_testapikey`;

		this.setupCron();
	}

	async setupCron() {
		// new user signups
		// 2160 / 60 = 36 mins(new user signs up avg every 36 minutes)
		setInterval(() => {
			let user = generateUser();
			this.onSignup(user);
			this.users.push(user);
		}, 2160);

		// every 9 seconds, a user logs in
		setInterval(() => {
			this.onUserLogin();
		}, 9000);

		// every 9 seconds, a user 'does' something
		setInterval(() => {
			this.onUserDoesSomething();
		}, 9000);
	}

	async onSignup(user) {
		// run event
		let log = {
			muted: false,
			test: false,
			userId: user.id,
			test: this.test,

			avatar: "👍",
			name: "User signed up",
			type: "rows",
			notify: true,
			actions: [],
			content: [
				{
					type: "text",
					label: "Email",
					content: user.email,
				},
				{
					type: "text",
					label: "IP",
					content: user.ip,
				},
				{
					type: "json",
					label: "form",
					content: {
						object: {
							id: "in_1Pv2ssHz7gs7nFkM9o1wEspO",
							object: "invoice",
							account_country: "AU",
							account_name: "Swipekit",
							account_tax_ids: null,
							amount_due: 3000,
							amount_paid: 0,
							amount_remaining: 3000,
							amount_shipping: 0,
							application: null,
							application_fee_amount: null,
							attempt_count: 3,
							attempted: true,
							auto_advance: true,
							automatic_tax: {
								enabled: false,
								liability: null,
								status: null,
							},
							automatically_finalizes_at: null,
							billing_reason: "subscription_cycle",
							charge: "ch_3Pv3p8Hz7gs7nFkM12wl5pYF",
							collection_method: "charge_automatically",
							created: 1725393566,
							currency: "usd",
							custom_fields: null,
							customer: "cus_Qb04V5pKZQQCN7",
							customer_address: null,
							customer_email: "davy.carvalho@profitlabs.com",
							customer_name: "DAVY",
							customer_phone: null,
							customer_shipping: null,
							customer_tax_exempt: "none",
							customer_tax_ids: [],
							default_payment_method: null,
							default_source: null,
							default_tax_rates: [],
							description: null,
							discount: null,
							discounts: [],
							due_date: null,
							effective_at: 1725397178,
							ending_balance: 0,
							footer: null,
							from_invoice: null,
							hosted_invoice_url:
								"https://invoice.stripe.com/i/acct_1Kqa46Hz7gs7nFkM/live_YWNjdF8xS3FhNDZIejdnczduRmtNLF9RbWM3WGhzMFdqTmVtcUhxRDd4RDRYZTBwTE42VDhjLDExNjEyMjc5NQ0200JzHDDs3X?s=ap",
							invoice_pdf:
								"https://pay.stripe.com/invoice/acct_1Kqa46Hz7gs7nFkM/live_YWNjdF8xS3FhNDZIejdnczduRmtNLF9RbWM3WGhzMFdqTmVtcUhxRDd4RDRYZTBwTE42VDhjLDExNjEyMjc5NQ0200JzHDDs3X/pdf?s=ap",
							issuer: {
								type: "self",
							},
							last_finalization_error: null,
							latest_revision: null,
							lines: {
								object: "list",
								data: [
									{
										id: "il_1Pv2ssHz7gs7nFkMAbi7F2Pr",
										object: "line_item",
										amount: 3000,
										amount_excluding_tax: 3000,
										currency: "usd",
										description: "1 × Swipekit Premium (at $30.00 / month)",
										discount_amounts: [],
										discountable: true,
										discounts: [],
										invoice: "in_1Pv2ssHz7gs7nFkM9o1wEspO",
										livemode: true,
										metadata: {},
										period: {
											end: 1727985469,
											start: 1725393469,
										},
										plan: {
											id: "price_1MSHa7Hz7gs7nFkMFvjcRLbl",
											object: "plan",
											active: true,
											aggregate_usage: null,
											amount: 3000,
											amount_decimal: "3000",
											billing_scheme: "per_unit",
											created: 1674209543,
											currency: "usd",
											interval: "month",
											interval_count: 1,
											livemode: true,
											metadata: {},
											meter: null,
											nickname: null,
											product: "prod_MeQ9rgnDzOo8vU",
											tiers_mode: null,
											transform_usage: null,
											trial_period_days: null,
											usage_type: "licensed",
										},
										price: {
											id: "price_1MSHa7Hz7gs7nFkMFvjcRLbl",
											object: "price",
											active: true,
											billing_scheme: "per_unit",
											created: 1674209543,
											currency: "usd",
											custom_unit_amount: null,
											livemode: true,
											lookup_key: null,
											metadata: {},
											nickname: null,
											product: "prod_MeQ9rgnDzOo8vU",
											recurring: {
												aggregate_usage: null,
												interval: "month",
												interval_count: 1,
												meter: null,
												trial_period_days: null,
												usage_type: "licensed",
											},
											tax_behavior: "unspecified",
											tiers_mode: null,
											transform_quantity: null,
											type: "recurring",
											unit_amount: 3000,
											unit_amount_decimal: "3000",
										},
										proration: false,
										proration_details: {
											credited_items: null,
										},
										quantity: 1,
										subscription: "sub_1Pjo5JHz7gs7nFkMEUBwIfjZ",
										subscription_item: "si_Qb05OkNqtHbJZJ",
										tax_amounts: [],
										tax_rates: [],
										type: "subscription",
										unit_amount_excluding_tax: "3000",
									},
								],
								has_more: false,
								total_count: 1,
								url: "/v1/invoices/in_1Pv2ssHz7gs7nFkM9o1wEspO/lines",
							},
							livemode: true,
							metadata: {},
							next_payment_attempt: null,
							number: "CDE4003E-0002",
							on_behalf_of: null,
							paid: false,
							paid_out_of_band: false,
							payment_intent: "pi_3Pv3p8Hz7gs7nFkM1UL1cQny",
							payment_settings: {
								default_mandate: null,
								payment_method_options: {
									acss_debit: null,
									bancontact: null,
									card: {
										request_three_d_secure: "automatic",
									},
									customer_balance: null,
									konbini: null,
									sepa_debit: null,
									us_bank_account: null,
								},
								payment_method_types: null,
							},
							period_end: 1725393469,
							period_start: 1722715069,
							post_payment_credit_notes_amount: 0,
							pre_payment_credit_notes_amount: 0,
							quote: null,
							receipt_number: null,
							rendering: null,
							rendering_options: null,
							shipping_cost: null,
							shipping_details: null,
							starting_balance: 0,
							statement_descriptor: null,
							status: "open",
							status_transitions: {
								finalized_at: 1725397178,
								marked_uncollectible_at: null,
								paid_at: null,
								voided_at: null,
							},
							subscription: "sub_1Pjo5JHz7gs7nFkMEUBwIfjZ",
							subscription_details: {
								metadata: {},
							},
							subtotal: 3000,
							subtotal_excluding_tax: 3000,
							tax: null,
							test_clock: null,
							total: 3000,
							total_discount_amounts: [],
							total_excluding_tax: 3000,
							total_tax_amounts: [],
							transfer_data: null,
							webhooks_delivered_at: 1725393567,
						},
						previous_attributes: null,
					},
				},
			],
			actions: [
				{
					url: `https://webhook.site/3c3b45dd-e545-47b6-b3b3-3b35da5ccd7c`,
					key: "ban_domain",
					buttonText: "Ban user?",
					meta: {
						name: "Shash",
					},
					expireIn: 1,
				},
				{
					url: `https://webhook.site/3c3b45dd-e545-47b6-b3b3-3b35da5ccd7c`,
					key: "ban_domain",
					buttonText: "Ban user?",
					meta: "Shash",
				},
				{
					url: `https://dashboard.stripe.com/payments/pi_3PfqepHz7gs7nFkM1xVCPoNW`,
					buttonText: "View in Stripe",
					external: true,
				},
			],
		};

		await this.ops.events.ingest(log);

		user = {
			firstName: user.name,
			email: user.email,
			userId: user.id,
			test: this.test,
		};

		await this.ops.users.identify(user);

		console.log(`[USER] - Signed up`);
	}

	async onUserLogin() {
		let uniqId = nanoid();

		let users = this.users;
		let randomIndex = Math.floor(Math.random() * users.length);

		let user = users[randomIndex];

		// run event

		let log = {
			muted: true,
			test: false,
			avatar: "🔑",
			test: this.test,
			name: `User logged in`,
			content: user.name,
			type: "text",
			contextId: uniqId,
			contextStart: true,
		};

		await this.ops.events.ingest(log);

		await new Promise((r) => setTimeout(r, 200));

		log = {
			muted: false,
			test: false,
			test: this.test,
			name: `User activated`,
			content: user.name,
			type: "text",
			contextId: uniqId,
		};

		await this.ops.events.ingest(log);

		await new Promise((r) => setTimeout(r, 500));

		log = {
			muted: false,
			test: false,
			test: this.test,
			name: `User onboarded`,
			content: user.name,
			type: "text",
			contextId: uniqId,
		};

		await this.ops.events.ingest(log);
	}

	async onUserDoesSomething() {
		let users = this.users;
		let randomIndex = Math.floor(Math.random() * users.length);

		let user = users[randomIndex];

		// run event

		let log = {
			muted: false,
			test: false,
			avatar: "🤔",
			test: this.test,
			name: `User did something`,
			content: user.name,
			type: "text",
		};

		await this.ops.events.ingest(log);
	}

	async sendEvent() {}
}

export default Saas;
