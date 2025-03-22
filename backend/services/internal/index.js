import Apikey from "#models/apikey.js";
import WorkspaceModel from "#components/workspace/model.js";
import prisma from "#lib/prisma.js";

import { nanoid } from "nanoid";
import moment from "moment";
import fs from "fs";
import path from "path";

import generateApikey from "#lib/generate-apikey.js";

/**
 * Internal stuff
 */
class Internal {
	cache = []; // [{key:123,workspaceId : 123,notifiers : [1,2]}]
	lastUpdate = null;
	loaded = false;

	async setup() {
		// Purposefully removed async so it doesn't hold up startup times
		this.checkUsersAndPerformAction();

		return true;
	}

	// Testing user imports for self-hosted version
	async checkUsersAndPerformAction() {
		return;
		try {
			// Simulate checking if users exist (replace with actual logic)
			const usersExist = await prisma.user.findFirst();

			if (!usersExist) {
				const userFilePath = path.resolve(__dirname, "user.json");

				// Check if user.json exists
				try {
					await fs.promises.access(userFilePath);
				} catch (err) {
					//console.log("user.json does not exist. No action performed.");
					return;
				}

				// Read and parse the user.json file
				const fileContent = await fs.promises.readFile(userFilePath, "utf-8");
				const userData = JSON.parse(fileContent);

				// Validate email and password
				const { email, password } = userData;

				if (email && password && password.length >= 8) {
					// Call the async function if validation passes
					console.log("import user");
					//await performAction(email, password);
				} else {
					console.log("Invalid email or password in user.json.");
				}
			} else {
				console.log("Users already exist. No action required.");
			}
		} catch (error) {
			console.error("An error occurred:", error.message);
		}
	}
}

export default new Internal();
