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
	ops;

	constructor(opts = {}) {
		let baseUrl = `http://0.0.0.0:2000`;

		let ops = new Operational(opts.apikey, {
			//baseUrl,
		});

		console.log(opts);

		this.ops = ops;

		let userLen = opts.userLen || 100;
		this.signupRate = opts.signupRate || 2160;
		for (let i = 0; i < userLen; i++) {
			let user = generateUser({
				paid: true,
			});
			this.users.push(user);
		}

		this.setupCron();

		let log = {
			muted: false,
			test: false,
			avatar: "👍",
			name: "Initial test event",
			type: "rows",
			content: [
				{
					type: "text",
					label: "Name",
					content: opts.email,
				},
				{
					type: "text",
					label: "Email",
					content: opts.email,
				},
			],
		};

		this.ops.events.ingest(log);

		console.log(`[USER] - initial event`);
	}

	async setupCron() {
		let signupRate = this.signupRate || 2160; // 36 minutes
		// new user signups
		// 2160 / 60 = 36 mins(new user signs up avg every 36 minutes)
		setInterval(() => {
			let user = generateUser();
			this.onSignup(user);
			this.users.push(user);
		}, signupRate);

		// every 7 seconds, a user logs in
		setInterval(() => {
			this.onUserLogin();
		}, 7000);

		// every 10 seconds, a user 'does' something
		setInterval(() => {
			this.onUserDoesSomething();
		}, 10000);
	}

	async onSignup(user) {
		// run event
		let log = {
			muted: false,
			test: false,
			userId: user.id,

			avatar: "👍",
			name: "User signed up",
			type: "rows",
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
			],
			actions: [
				{
					url: `https://webhook.site/73458ad3-2b26-438e-a90c-0876ed962bb3`,
					buttonText: "Ban user?",
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
			muted: false,
			test: false,
			avatar: "🔑",
			name: `User logged in`,
			content: user.name,
			type: "text",
			contextId: uniqId,
			contextType: 1,
		};

		await this.ops.events.ingest(log);

		await new Promise((r) => setTimeout(r, 1000));

		log = {
			muted: false,
			test: false,
			avatar: "🔑",
			name: `User activated`,
			content: user.name,
			type: "text",
			contextId: uniqId,
			contextType: 2,
		};

		await this.ops.events.ingest(log);

		await new Promise((r) => setTimeout(r, 2000));

		log = {
			muted: false,
			test: false,
			avatar: "🔑",
			name: `User onboarded`,
			content: user.name,
			type: "text",
			contextId: uniqId,
			contextType: 2,
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
			name: `User did something`,
			content: user.name,
			type: "text",
		};

		await this.ops.events.ingest(log);
	}

	async sendEvent() {}
}

export default Saas;
