import User from "#components/user/model.js";
import prisma from "#lib/prisma.js";
import Webpush from "#services/webpush/index.js";
import os from "os";
import si from "systeminformation";
import diskusage from "diskusage";
import config from "#lib/config.js";

const component = {
	async subscribe(user, subscription, sid) {
		let condition = await prisma.workspaceUser.update({
			where: {
				userId_workspaceId: {
					userId: user.id,
					workspaceId: user.primaryWorkspace,
				},
			},
			data: {
				pushSubscription: subscription,
			},
		});

		// first, find if push exists with the current sid.
		let session = null;
		if (sid) {
			session = await prisma.session.findUnique({
				where: {
					sid: sid,
				},
			});
		}

		if (session) {
			let pushes = await prisma.push.findMany({
				take: 1,
				where: {
					userId: user.id,
					sid: sid,
				},
			});
			if (pushes.length === 0) {
				// create the push
				let push = await prisma.push.create({
					data: {
						userId: user.id,
						sid: sid,
						pushSubscription: subscription,
					},
				});
			} else {
				// update the push
				let push = pushes[0];
				push = await prisma.push.update({
					where: {
						id: push.id,
					},
					data: {
						pushSubscription: subscription,
					},
				});
			}
		}

		// No need to update the user or anything like that.
		return true;
	},

	async sendTestPushNotification(userId) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				workspace: true,
				pushes: true,
			},
		});

		let notify = false;
		let pushSubscriptions = [];

		for (let i = 0; i < user.workspace.length; i++) {
			const workspaceUser = user.workspace[i];

			if (
				workspaceUser.userId === user.id &&
				workspaceUser.workspaceId === user.primaryWorkspace
			) {
				notify = workspaceUser.notify;
				break;
			}
		}

		for (let i = 0; i < user.pushes.length; i++) {
			const push = user.pushes[i];
			if (push.pushSubscription) {
				pushSubscriptions.push(push.pushSubscription);
			}
		}

		if (!notify) {
			throw `Account level notifications are off.`;
		}

		if (pushSubscriptions.length === 0) {
			throw `No push subscriptions found`;
		}

		let message = {
			message: `🤖 Test notification from the backend`,
		};

		try {
			for (let i = 0; i < pushSubscriptions.length; i++) {
				const pushSubscription = pushSubscriptions[i];
				await Webpush.sendNotification(
					pushSubscription.endpoint,
					pushSubscription.keys,
					message,
				);
			}

			return pushSubscriptions;
		} catch (err) {
			if (err.statusCode === 401 || err.statusCode === 404) {
				throw `Push subscription expired or invalid.`;
			} else {
				throw `Push notification failed ${err}`;
			}
		}
	},

	async getStats() {
		try {
			// Get OS information
			const osInfo = {
				os: os.platform(),
				osVersion: os.release(),
			};

			// Get CPU information
			const cpuInfo = await si.cpu();
			const cpuBrand = cpuInfo.brand;

			// Get total memory (RAM) in bytes
			const totalMemory = os.totalmem();

			// Get disk space information
			const diskInfo = await diskusage.check("/"); // Replace '/' with your specific disk path if needed

			const systemStats = {
				os: osInfo.os,
				osVersion: osInfo.osVersion,
				cpuBrand: cpuBrand,
				ram: this.formatBytes(totalMemory),
				totalDiskSpace: this.formatBytes(diskInfo.total),
				availableDiskSpace: this.formatBytes(diskInfo.available),
			};

			return systemStats;
		} catch (error) {
			console.error("Error retrieving system stats:", error);
			return null;
		}
	},

	getEnvVars() {
		const obj = {
			env: config.env,

			resendToken: "",

			vapidEmail: "",
			vapidPublicKey: "",
			vapidPrivateKey: "",
		};
	},

	formatBytes(bytes) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	},

	async checkConnnection() {
		const exists = await prisma.user.findFirst({
			select: { id: true },
		});

		const hasUsers = !!exists;

		if (hasUsers) {
			throw "Already connected";
		}

		let stats = await this.getStats();

		return {
			...stats,
		};
	},
};

export default component;
