/**
 * This file will assume a health saas business of 5k usd MRR
 * It assumes:
 * - A $50 p/m subscription prices
 * - 1% conversion ratio
 * - 50 signups every day
 * - 100 existing customers
 */
import "dotenv/config";
import Test from "./test/index.js";
import Saas from "./test/saas.js";
import gen from "./test/genv2.js";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { JSONFilePreset } from "lowdb/node";

import Operational from "@operational.co/sdk";

const ops = new Operational(`ops_niceoneniceone`);

// ops.events.ingest({
// 	name: "user signed up",
// 	avatar: "😀",
// 	type: "rows",
// 	content: [
// 		{
// 			label: "Signup date",
// 			content: "1th July 19:30(your timezone)",
// 		},
// 		{
// 			label: "Referrer",
// 			content: "seometrics.co",
// 		},
// 		{
// 			label: "Form",
// 			type: "json",
// 			content: {
// 				name: "Shash",
// 				email: "shash@operational.co",
// 			},
// 		},
// 	],
// 	actions: [
// 		{
// 			buttonText: "View in Stripe",
// 			url: "https://api.operational.co/api/demo",
// 			external: true,
// 		},
// 		{
// 			buttonText: "Ban user",
// 			key: "ban_user",
// 			url: "https://api.operational.co/api/demo",
// 		},
// 		{
// 			buttonText: "Extend trial",
// 			key: "extend_trial",
// 			url: "https://api.operational.co/api/demo",
// 		},
// 	],
// });

new Saas();

class Operational123 {
	baseUrl = `https://api.operational.co`; //`http://0.0.0.0:2000`;
	db = null;

	constructor() {
		// assume a new user to signup every 144 minutes
		let duration = 8640;

		this.init();

		//setInterval(this.addUser, duration);
	}

	async init() {
		await new Promise((r) => setTimeout(r, 4000));
		const defaultData = { users: [] };
		this.db = await JSONFilePreset("db.json", defaultData);
		for (let i = 0; i < this.db.data.users.length; i++) {
			let user = this.db.data.users[i];
			console.log(`[${i}][User] registering ${user.email} ${user.apikey}`);
			this.registerUser(user);
		}

		// Now add users. Add 10 users everyday
		let duration = 8640;
		setInterval(this.addUser.bind(this), duration);
	}

	registerUser(user) {
		new Test(user);
	}

	async addUser() {
		let name = `${faker.color.human()}.${faker.animal.type()}`;
		name = name.replace(/\s/g, "");
		let email = `${name}@mailinator.com`;
		let password = `${name}.password`;
		let user = {
			firstName: name,
			email,
			password,
		};

		let url = `${this.baseUrl}/user/signup`;

		let res = await axios.post(url, user).catch((err) => {
			console.log(url);
			console.log(user);
			console.log(err.response);
			return;
		});

		if (!res) {
			return;
		}

		let payload = res.data;

		let config = generateConfig();

		user = {
			email: payload.user.email,
			password,
			workspaceId: payload.workspace.id,
			apikey: payload.apikey.key,
			...config,
		};

		this.db.data.users.push(user);

		this.registerUser(user);

		await this.db.write();
	}
}

function getWeightedRandom(weights) {
	// Calculate the total weight
	const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

	// Generate a random number between 0 and the total weight
	const random = Math.random() * totalWeight;

	// Determine which weight range the random number falls into
	let cumulativeWeight = 0;
	for (let i = 0; i < weights.length; i++) {
		cumulativeWeight += weights[i];
		if (random < cumulativeWeight) {
			return i; // Return the index of the selected weight
		}
	}
}

function generateConfig() {
	const weights = [5, 3, 2, 0.75, 0.1];
	const weight = getWeightedRandom(weights);

	// Small company, still trying to figure everything
	let config = {
		userLen: 1,
		signupRate: 43200,
	};

	// Made their first paycheck, still trying to figure everything
	if (weight === 1) {
		config = {
			userLen: 11,
			signupRate: 21600,
		};
	}

	// Small micro-saas company, optimizing their pmf
	if (weight === 2) {
		config = {
			userLen: 90,
			signupRate: 5400,
		};
	}

	// small micro-saas company, now entering growth phase
	if (weight === 3) {
		config = {
			userLen: 250,
			signupRate: 1350,
		};
	}

	// mid weight company, in solid growth phase
	if (weight === 4) {
		config = {
			userLen: 700,
			signupRate: 337,
		};
	}

	return config;
}

//new Operational();
