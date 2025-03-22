import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";

import hashPassword from "#lib/hash-password.js";
import comparePassword from "#lib/compare-password.js";

class Workspace extends Model {
	async findById(workspaceId) {
		const query = {
			where: {
				id: workspaceId,
			},
		};

		try {
			const user = await this.client.findUnique(query);

			return user;
		} catch (err) {
			throw err;
		}
	}

	async login(form) {
		const email = form.email;
		const password = form.password;

		const query = {
			where: {
				email: email,
			},
		};

		const users = await this.client.findMany(query);

		if (users.length === 0) {
			throw "User not found";
		}

		const user = users[0];

		const condition = await comparePassword(password, user.password);

		if (!condition) {
			throw `Can't find any users with those login details`;
		}

		delete user.password;

		return user;
	}

	async signup(user, projectName, isSetup = false) {
		let companyName = projectName || user.firstName || `user's company`;
		let workspace = await this.client
			.create({
				data: {
					name: companyName,
					adminId: user.id,
				},
			})
			.catch((err) => {
				throw err;
			});

		return workspace;
	}

	async update(resource) {
		let id = parseInt(resource.id);

		delete resource.id;

		if (resource.meta) {
			let pastResource = await this.findById(id);

			resource.meta = {
				...(pastResource.meta || {}),

				...resource.meta,
			};
		}

		let query = {
			where: {
				id: id,
			},
			data: resource,
		};

		delete query.data.id;

		resource = await this.client.update(query).catch((err) => {
			this.captureException(err);

			throw err;
		});

		//resource = await this.findById(id);

		//this.afterWrite(resource);

		return resource;
	}
}

export default new Workspace("workspace", prisma);
