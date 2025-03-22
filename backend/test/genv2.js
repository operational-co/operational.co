import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

import ch from "#lib/clickhouse.js";
import mongo from "#lib/mongodb.js";

function generateWorkspaceId() {
	let num = faker.number.int({ min: 1, max: 200 });
	if (num === 2) {
		num = 1;
	}

	return num;
}

const generateRecord = () => ({
	id: uuidv4(),
	workspaceId: generateWorkspaceId(),
	userId: uuidv4(),
	name: faker.commerce.productName(),
	actions: Array.from({ length: 3 }, () => faker.hacker.verb()),
	avatar: faker.image.avatarLegacy(),
	actions: faker.lorem.paragraph(),
	content: faker.lorem.paragraph(),
	type: faker.lorem.word(),
	muted: faker.datatype.boolean(),
	test: faker.datatype.boolean(),
	notify: faker.datatype.boolean(),
	searchable: faker.lorem.words(3),
	contextId: uuidv4(),
	createdAt: new Date().toISOString().replace("T", " ").replace("Z", ""),
	version: 0,
});

const bulkInsert = async (clickhouse, mongoClient) => {
	let len = 10000;
	const records = Array.from({ length: len }, generateRecord);

	// let res = await clickhouse.insert({
	// 	table: "Events2",
	// 	format: "JSONEachRow",
	// 	values: records,
	// });

	const mongoCollection = mongo.db.collection("Events2");
	await mongoCollection.insertMany(records);
};

const runInserts = async () => {
	let len = 10;
	try {
		await mongo.connect();

		await mongo.db.command({
			compact: "Events2",
		});

		const stats = await mongo.db.stats();

		console.log(stats);

		console.log("---");

		return;

		for (let i = 0; i < len; i++) {
			await bulkInsert(ch, mongo).catch((err) => {
				console.log(err);
			});
			console.log(`Batch ${i + 1} inserted`);
		}

		console.log("Data insertion completed");
	} catch (error) {
		console.error("Error during insertion:", error);
	} finally {
		await mongo.disconnect();
	}
};

export default runInserts;
