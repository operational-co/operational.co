import { createClient } from "@clickhouse/client";
import fs from "fs";
import path from "path";
import config from "#lib/config.js";

let localConfig = {
	url: "http://localhost:8123",
	database: "operational",
	port: 9000,
	username: "default",
	password: "",
};

let chConfig = {
	url: process.env.CLICKHOUSE_URL,
	//database: "operational",
	keep_alive: {
		enabled: true,
		idle_socket_ttl: 2500,
	},
};

let ch = null;

if (config.EVENT_STORE === "clickhouse") {
	createClient(chConfig);
} else {
	ch = () => {};
}

// Function to insert dummy data
const insertDummyData = async () => {
	try {
		// Dummy data to insert
		const data = [
			{
				id: "00000000-0000-0000-0000-000000000001",
				workspaceId: 1,
				userId: 101,
				createdAt: "2024-07-24 12:00:00",
				actions: ["login", "view"],
				avatar: "https://example.com/avatar1.png",
				content: "Sample content 1",
				type: "info",
				muted: false,
				test: false,
				searchable: "sample search content 1",
			},
			{
				id: "00000000-0000-0000-0000-000000000002",
				workspaceId: 1,
				userId: 102,
				createdAt: "2024-07-24 12:05:00",
				actions: ["click", "purchase"],
				avatar: "https://example.com/avatar2.png",
				content: "Sample content 2",
				type: "warning",
				muted: true,
				test: true,
				searchable: "sample search content 2",
			},
		];

		for (let i = 0; i < data.length; i++) {
			let row = data[i];

			await ch.insert({
				table: "Events",
				format: "JSONEachRow",
				values: [row],
			});
		}

		console.log("Dummy data inserted successfully.");
	} catch (error) {
		console.error("Error inserting data:", error);
	}
};

async function migrate() {
	console.log("RUNNING MIGRATIONS");
	const __dirname = path.resolve("");

	let filePath = path.join(
		__dirname,
		"./prisma/clickhouse-migrations/1_initial-commit.sql",
	);

	let folderPath = path.join(__dirname, "./prisma/clickhouse-migrations");

	const files = await fs.promises.readdir(folderPath);

	// Filter for .sql files
	const sqlFiles = files.filter((file) => file.endsWith(".sql"));

	// Read the contents of each .sql file
	const fileContents = await Promise.all(
		sqlFiles.map(async (file) => {
			const filePath = path.join(folderPath, file);
			const content = await fs.promises.readFile(filePath, "utf-8");
			return { file, content };
		}),
	);

	for (let i = 0; i < fileContents.length; i++) {
		let { content } = fileContents[i];
		await runMigration(content);
	}

	let rows = [
		{
			id: "00000000-0000-0000-0000-000000000002",
			workspaceId: 1,
			userId: 102,
			createdAt: "2024-07-24 12:05:00",
			actions: ["click", "purchase"],
			avatar: "https://example.com/avatar2.png",
			content: "Sample content 2",
			type: "text",
			muted: false,
			test: false,
			name: "sample search content 2",
		},
		{
			id: "00000000-0000-0000-0000-000000000002",
			workspaceId: 1,
			userId: 102,
			createdAt: "2024-07-24 12:05:00",
			actions: ["click", "purchase"],
			avatar: "https://example.com/avatar2.png",
			content: "Sample content 2 updated",
			type: "text",
			muted: false,
			test: false,
			name: "sample search content 2 updated",
			version: 1,
		},
	];

	for (let i = 0; i < rows.length; i++) {
		let row = rows[i];

		// await ch.insert({
		// 	table: "Events",
		// 	format: "JSONEachRow",
		// 	values: [row],
		// });
	}
}

async function runMigration(sql) {
	let res = await ch
		.query({
			query: sql,
		})
		.catch((err) => {
			console.log(err);
		});

	console.log("Migration ran");

	return res;
}

//migrate();

//insertDummyData();

export default ch;
