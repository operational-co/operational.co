import { faker } from "@faker-js/faker";
import moment from "moment";

function shouldReturnFalse() {
	// Generate a random number between 0 and 1
	const randomNumber = Math.random();

	// Probability threshold for returning false (25% chance)
	const threshold = 0.2;

	// Return true or false based on the threshold
	return randomNumber < threshold;
}

function generateEvent(type, event = null) {
	let e = null;
	if (type === "signup") {
		e = generateSignupEvent();
	}
	if (type === "verify") {
		e = generateVerifyEvent(event);
	}
	if (type === "onboard") {
		e = generateOnboardEvent(event);
	}
	if (type === "login") {
		e = generateLoginEvent();
	}
	if (type === "stuff") {
		e = generateStuffEvent();
	}
	if (type === "unsubscribe") {
		e = generateUnsubscribeEvent();
	}
	if (type === "trial") {
		e = generateTrialEvent();
	}
	if (type === "cron") {
		e = generateCronEvent();
	}
	if (type === "cron:success") {
		e = generateCronSuccessEvent(event);
	}
	if (type === "webhook") {
		e = generateWebhookEvent(event);
	}

	return e;
}

function generateCronSuccessEvent(event) {
	let condition = shouldReturnFalse();

	let e = {
		name: "",
		contextId: event.contextId,
	};

	if (!condition) {
		e.name = "user reconcillation succeeded";
	}

	if (condition) {
		e.name = "user reconcillation failed";
		e.type = "rows";
		e.content = [
			{
				label: "id",
				content: faker.string.uuid(),
			},
			{
				label: "stripecustomerid",
				content: "cus_2g4354hty4t3gtyht",
			},
		];
	}

	return e;
}

function generateCronEvent() {
	let id = faker.string.uuid();

	let contextId = `cron_${id}`;

	let e = {
		avatar: "🤖",
		name: "cron running reconcillation check",
		contextStart: true,
		contextId: contextId,
	};

	return e;
}

function generateWebhookEvent() {
	let e = {
		avatar: "🤖",
		name: "stripe webhook received",
		type: "json",
		content: {
			id: "in_1PxfU2Hz7gs7nFk3N7U4FIg5",
			object: "invoice",
			account_country: "AU",
			account_name: "Swipekit",
			account_tax_ids: null,
			amount_due: 3000,
			amount_paid: 3000,
			amount_remaining: 0,
			amount_shipping: 0,
			application: null,
			application_fee_amount: null,
			attempt_count: 1,
			attempted: true,
			auto_advance: false,
			automatic_tax: {
				enabled: false,
				liability: null,
				status: null,
			},
			automatically_finalizes_at: null,
			billing_reason: "subscription_create",
			charge: "ch_3PxfUdHz7gs7nd45X3fSTh8",
			collection_method: "charge_automatically",
			created: 1723018610,
			currency: "usd",
			custom_fields: null,
			customer: "cus_Pi1ePchW5lzhFr",
			customer_address: null,
			customer_email: "vikgamerketer@gmail.com",
			customer_name: "Hosier",
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
			effective_at: 1723018610,
			ending_balance: 0,
			footer: null,
			from_invoice: null,
			hosted_invoice_url: "<REDACTED>",
			issuer: {
				type: "self",
			},
			last_finalization_error: null,
			latest_revision: null,
			lines: {
				object: "list",
				data: [
					{
						id: "il_1PxfUFHz7gs7nFkW9Y2teYru",
						object: "line_item",
						amount: 3000,
						amount_excluding_tax: 3000,
						currency: "usd",
						description: "1 × Swipekit Premium (at $30.00 / month)",
						discount_amounts: [],
						discountable: true,
						discounts: [],
						invoice: "in_1PxWUEHz7gD7nFkMNFUHFIgG",
						livemode: true,
						metadata: {},
						period: {
							end: 1723610610,
							start: 1723018610,
						},
						plan: {
							id: "price_1MSHW7Hz7gs7nFkMFvjcBLbl",
							object: "plan",
							active: true,
							aggregate_usage: null,
							amount: 3000,
							amount_decimal: "3000",
							billing_scheme: "per_unit",
							created: 1644209543,
							currency: "usd",
							interval: "month",
							interval_count: 1,
							livemode: true,
							metadata: {},
							meter: null,
							nickname: null,
							product: "prod_MSQ9rgnFzOF8vU",
							tiers_mode: null,
							transform_usage: null,
							trial_period_days: null,
							usage_type: "licensed",
						},
						price: {
							id: "price_1MAHa7Hz7gs7nFkSFvjcFLbl",
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
							product: "prod_MeQ9rgWDzOoFvU",
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
						subscription: "sub_1PFfUEHz7gs7SFkMcZbSxm4t",
						subscription_item: "si_QpK8o0010FTakS",
						tax_amounts: [],
						tax_rates: [],
						type: "subscription",
						unit_amount_excluding_tax: "3000",
					},
				],
				has_more: false,
				total_count: 1,
				url: "/v1/invoices/in_1FxfUEHz7gsGnFkMN7UWFIgG/lines",
			},
			livemode: true,
			metadata: {},
			next_payment_attempt: null,
			number: "E3A6EE07-0007",
			on_behalf_of: null,
			paid: true,
			paid_out_of_band: false,
			payment_intent: "pi_3PxfUFAz7gs7nFkMWbWuFKOT",
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
			period_end: 1735018610,
			period_start: 1736018610,
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
			status: "paid",
			status_transitions: {
				finalized_at: 1736018610,
				marked_uncollectible_at: null,
				paid_at: 1736018612,
				voided_at: null,
			},
			subscription: "sub_1sxfUEHz7Ss7nFkMcZb5xm4t",
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
			webhooks_delivered_at: null,
		},
	};

	return e;
}

function generateTrialEvent() {
	let email = faker.internet.email();

	let e = {
		name: "user trial ended",
		type: "rows",
		avatar: "😐",
		notify: true,
		content: [
			{
				label: "email",
				content: email,
			},
			{
				label: "Bookmarks created",
				content: 32 + "",
			},
		],
		actions: [
			{
				buttonText: "Extend trial?",
				key: "extend_trial",
				url: "https://api.operational.co/demo",
			},
			{
				buttonText: "Ask for review and extend trial?",
				key: "ask_for_review_and_extend_trial",
				url: "https://api.operational.co/demo",
			},
		],
	};

	return e;
}

function generateUnsubscribeEvent() {
	let email = faker.internet.email();

	let e = {
		name: "user unsubscribed",
		type: "rows",
		avatar: "😔",
		notify: true,
		content: [
			{
				label: "email",
				content: email,
			},
			{
				label: "Bookmarks created",
				content: 122 + "",
			},
			{
				label: "Invoices generated",
				content: 3 + "",
			},
		],
		actions: [
			{
				buttonText: "Reach out to user?",
				key: "reach_user",
				url: "https://api.operational.co/demo",
			},
		],
	};

	return e;
}

function generateStuffEvent() {
	let email = faker.internet.email();

	let arr = [
		"user invited another user",
		"user updated their settings",
		"user updated their email",
	];
	const randomIndex = Math.floor(Math.random() * arr.length);
	let e = {
		name: arr[randomIndex],
		type: "rows",
		avatar: "🔧",
		muted: true,
		content: [
			{
				label: "email",
				content: email,
			},
		],
	};

	return e;
}

function generateLoginEvent(event) {
	let id = faker.string.uuid();
	let name = faker.person.fullName();
	let email = faker.internet.email();
	let companyName = faker.company.name();
	let ip = faker.internet.ipv4();

	let e = {
		name: "user logged in",
		avatar: "🚪",
		muted: true,
		type: "rows",
		content: [
			{
				label: "email",
				content: email + "",
			},
			{
				label: "IP",
				content: ip + "",
			},
			{
				label: "ID",
				content: id,
			},
		],
	};

	return e;
}

function generateOnboardEvent(event) {
	let e = {
		name: "user onboarded",
		contextId: event.contextId,
	};

	return e;
}

function generateVerifyEvent(event) {
	let e = {
		name: "user verified",
		contextId: event.contextId,
	};

	return e;
}

function generateSignupEvent() {
	let id = faker.string.uuid();
	let name = faker.person.fullName();
	let email = faker.internet.email();
	let companyName = faker.company.name();
	let ip = faker.internet.ipv4();

	let contextId = `user_signup_${id}`;

	let e = {
		avatar: "😃",
		name: "user signup",
		type: "rows",
		content: [
			{
				label: "Name",
				content: name + "",
			},
			{
				label: "email",
				content: email + "",
			},
			{
				label: "company name",
				content: companyName + "",
			},
			{
				label: "IP",
				content: ip + "",
			},
			{
				label: "ID",
				content: id,
			},
		],
		actions: [
			{
				buttonText: "Activate user manually?",
				key: "activate_user",
				url: "https://api.operational.co/demo",
			},
			{
				buttonText: "Ban email",
				key: "ban_email",
				url: "https://api.operational.co/demo",
			},
			{
				buttonText: "Ban domain",
				key: "ban_domain",
				url: "https://api.operational.co/demo",
			},
		],
		contextStart: true,
		contextId: contextId,
	};

	return e;
}

export default generateEvent;
