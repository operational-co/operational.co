import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";

import hashPassword from "#lib/hash-password.js";
import comparePassword from "#lib/compare-password.js";

class Metric extends Model {
	async findById(workspaceId) {
		const query = {
			where: {
				id: workspaceId,
			},
			include: {
				admin: true,
			},
		};

		try {
			const user = await this.client.findUnique(query);

			return user;
		} catch (err) {
			throw err;
		}
	}

	async findByWorkspaceId(workspaceId) {
		const query = {
			where: {
				workspaceId,
			},
		};

		try {
			const metrics = await this.client.findMany(query);

			return metrics || null;
		} catch (err) {
			throw err;
		}
	}

	async findByMonth(workspaceId, month) {
		const query = {
			where: {
				workspaceId,
				month,
			},
		};

		try {
			const metrics = await this.client.findMany(query);

			return metrics[0] || null;
		} catch (err) {
			throw err;
		}
	}

	async create(workspaceId, month, year, events = 0) {
		const query = {
			data: {
				workspaceId,
				month,
				year,
				events,
			},
		};

		try {
			const metric = await this.client.create(query);

			return metric;
		} catch (err) {
			throw err;
		}
	}

	async update(payload) {
		let id = payload.id;
		id = parseInt(id);

		delete payload.id;

		const query = {
			where: {
				id,
			},
			data: {
				...payload,
			},
		};

		try {
			const metric = await this.client.update(query);

			return metric;
		} catch (err) {
			throw err;
		}
	}
}

export default new Metric("metric", prisma);
