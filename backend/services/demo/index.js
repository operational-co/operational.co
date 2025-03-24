import Operational from "@operational.co/sdk";
import generateEvent from "./generate-event.js";
import moment from "moment";
import config from "#lib/config.js";

class Demo {
	users = [
		{
			apikey: `ops_x3llkvlv9mim1iz4aq7vx4lp`,
		},
	];

	signupId = null;
	loginIdId = null;
	miscId = null;
	unsubscribeId = null;
	trialId = null;
	cronId = null;
	webhookId = null;
	opsOptions = {};

	constructor() {}

	setup() {
		//this.generateEventsForUsers();

		this.opsOptions = {
			baseUrl: config.operational.BASEURL || undefined,
		};

		return true;
	}

	async generateEventsForUsers() {
		let users = this.users;
		for (let i = 0; i < users.length; i++) {
			let user = users[i];

			this.sigupId = setInterval(() => {
				this.generateSignupEvents(user);
			}, 24000); // Generate a user signup every 24 minutes

			this.loginId = setInterval(() => {
				this.generateLoginEvents(user);
			}, 8000); // Generate a login event every 8 minutes

			this.miscId = setInterval(() => {
				this.generateMiscEvents(user);
			}, 5000); // Generate a random event every 5 minutes

			this.unsubscribeId = setInterval(() => {
				this.generateUnsubscribeEvent(user);
			}, 24000); // Generate a random event every 24 minutes

			this.trialId = setInterval(() => {
				this.generateTrialEvent(user);
			}, 22000); // Generate a random event every 22 minutes

			this.cronId = setInterval(() => {
				this.generateCronEvent(user);
			}, 20000); // Generate a cron event every 20 minutes

			this.webhookId = setInterval(() => {
				this.generateWebhookEvent(user);
			}, 32000); // Generate a cron event every 32 minutes
		}
	}

	async generateSignupEvents(user) {
		let ops = new Operational(user.apikey, this.opsOptions);
		let signupEvent = generateEvent("signup");

		let interval = this.generateRandom(16, 24);
		interval = interval * 1000;

		await ops.events.ingest(signupEvent);

		await new Promise((r) => setTimeout(r, interval));

		let verifyEvent = generateEvent("verify", signupEvent);

		await ops.events.ingest(verifyEvent);

		interval = this.generateRandom(30, 38);
		interval = interval * 1000;

		let onboardEvent = generateEvent("onboard", signupEvent);

		await ops.events.ingest(onboardEvent);
	}

	async generateLoginEvents(user) {
		let ops = new Operational(user.apikey, this.opsOptions);

		let loginEvent = generateEvent("login");

		await ops.events.ingest(loginEvent);
	}

	async generateMiscEvents(user) {
		let ops = new Operational(user.apikey, this.opsOptions);

		let miscEvent = generateEvent("stuff");

		await ops.events.ingest(miscEvent);
	}

	async generateUnsubscribeEvent(user) {
		let ops = new Operational(user.apikey, this.opsOptions);

		let miscEvent = generateEvent("unsubscribe");

		await ops.events.ingest(miscEvent);
	}

	async generateTrialEvent(user) {
		let ops = new Operational(user.apikey, this.opsOptions);

		let trialEvent = generateEvent("trial");

		await ops.events.ingest(trialEvent);
	}

	async generateCronEvent(user) {
		let ops = new Operational(user.apikey, this.opsOptions);
		let cronEvent = generateEvent("cron");

		await ops.events.ingest(cronEvent);

		for (let i = 0; i < 12; i++) {
			let interval = 1200;

			await new Promise((r) => setTimeout(r, interval));

			let e = generateEvent("cron:success", cronEvent);

			await ops.events.ingest(e);
		}
	}

	async generateWebhookEvent(user) {
		let ops = new Operational(user.apikey, this.opsOptions);
		let webhookEvent = generateEvent("webhook");

		await ops.events.ingest(webhookEvent);
	}

	generateRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

export default new Demo();
