import { MongoClient, ObjectId } from "mongodb";

const url = process.env.MONGODB_URL;
let dbName = "operational-staging";
if (process.env.NODE_ENV === "production") {
	dbName = "operational";
}

const config = "#lib/config.js";

class MongoSingleton {
	db;
	client;

	constructor() {
		if (this.isInitialized()) return this.client;

		// Initialize the connection.
		this.client = new MongoClient(url, {});
	}

	isInitialized() {
		return this.client !== undefined;
	}

	async connect() {
		if (this.db) {
			return true;
		}
		await this.client.connect();
		this.db = this.client.db(); // if blank, dbName is infered from connection url.
		return this.db;
	}

	async disconnect() {
		await this.client.close();
	}

	generateObjectId() {
		return new ObjectId();
	}
}

export default new MongoSingleton();
