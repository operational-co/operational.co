import { createClient } from "@clickhouse/client";
import fs from "fs";
import path from "path";

import config from "#lib/config.js";

class Clickhouse {
	options = {
		utcOffset: 0,
	};
	ch;

	async setup() {
		const chConfig = {
			url: process.env.CLICKHOUSE_URL,
			//database: "operational",
			keep_alive: {
				enabled: true,
				idle_socket_ttl: 2500,
			},
		};

		let ch = null;

		if (config.EVENT_STORE === "clickhouse") {
			ch = createClient(chConfig);
		} else {
			ch = () => {};
		}

		this.ch = ch;
	}

	getCh() {
		return this.ch;
	}

	async migrate() {
		console.log("RUNNING MIGRATIONS");
		const __dirname = path.resolve("");

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
			await this.runMigration(content);
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

	async runMigration(sql) {
		let res = await this.ch
			.query({
				query: sql,
			})
			.catch((err) => {
				console.log(err);
			});

		console.log("Migration ran");

		return res;
	}
}

export default new Clickhouse();
