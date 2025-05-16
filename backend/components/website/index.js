import User from "#components/user/model.js";
import prisma from "#lib/prisma.js";
import Webpush from "#services/webpush/index.js";
import Storage from "#services/storage/index.js";
import os from "os";
import si from "systeminformation";
import config from "#lib/config.js";
import Email from "#services/email/index.js";
import Db from "#services/db/index.js";

const component = {
  async subscribe(user, subscription, sid) {
    console.log(`Subscribing user ${user.id} with sid: ${sid}`);
    // let condition = await prisma.workspaceUser.update({
    //  where: {
    //    userId_workspaceId: {
    //      userId: user.id,
    //      workspaceId: user.primaryWorkspace,
    //    },
    //  },
    //  data: {
    //    pushSubscription: subscription,
    //  },
    // });

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
      //console.log(`session found`);
      let pushes = await prisma.push.findMany({
        take: 1,
        where: {
          userId: user.id,
          sid: sid,
        },
      });
      if (pushes.length === 0) {
        //console.log(`pushes not found. Creating one`);
        // create the push
        let push = await prisma.push.create({
          data: {
            userId: user.id,
            sid: sid,
            pushSubscription: subscription,
          },
        });
        //console.log(push);
      } else {
        // update the push
        let push = pushes[0];
        //console.log(`push found, updating it: ${push.id}`);
        push = await prisma.push.update({
          where: {
            id: push.id,
          },
          data: {
            pushSubscription: subscription,
          },
        });
      }
    } else {
      //console.log("session not found");
      //??
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

      if (workspaceUser.userId === user.id && workspaceUser.workspaceId === user.primaryWorkspace) {
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
        await Webpush.sendNotification(pushSubscription.endpoint, pushSubscription.keys, message);
      }

      return pushSubscriptions;
    } catch (err) {
      console.log(err);
      if (err.statusCode === 401 || err.statusCode === 403 || err.statusCode === 404) {
        throw `Push subscription expired or invalid.`;
      } else {
        throw `Push notification failed ${err.body}`;
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

      const fsData = await si.fsSize();

      // Pick the root volume (mounted at `/`)
      const rootFs = fsData.find((fs) => fs.mount === "/");

      const systemStats = {
        os: osInfo.os,
        osVersion: osInfo.osVersion,
        cpuBrand: cpuBrand,
        ram: this.formatBytes(totalMemory),
        totalDiskSpace: this.formatBytes(rootFs.size),
        availableDiskSpace: this.formatBytes(rootFs.available),
      };

      console.log(systemStats);

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

  async doTests() {
    let tests = [];

    let emailService = await Email.test();
    let storageService = await Storage.test();
    let webpushService = await Webpush.test();
    let dbService = await Db.test();

    tests.push(emailService);
    tests.push(storageService);
    tests.push(webpushService);
    tests.push(dbService);

    return tests;
  },

  async checkConnnection() {
    const exists = await prisma.user.findFirst({
      select: { id: true },
    });

    if (!config.SECRET) {
      throw `SECRET is missing. Set the SECRET="random_string" env var inside /backend and restart the server`;
    }

    const hasUsers = !!exists;

    if (hasUsers) {
      throw "Already connected";
    }

    let stats = await this.getStats();

    stats.services = await this.doTests();

    return {
      ...stats,
    };
  },

  async getPush(userId) {
    // Step 1: Get the session for the user
    const session = await prisma.session.findFirst({
      where: { userId },
      select: {
        id: true,
        sid: true,
        userId: true,
        user: true,
        userAgent: true,
        expiresAt: true,
      },
    });

    if (!session) return null;

    // Step 2: Get push data using the session's sid
    const push = await prisma.push.findFirst({
      where: {
        sid: session.sid,
      },
      select: {
        id: true,
        sid: true,
        userId: true,
        pushSubscription: true,
      },
    });

    return {
      session,
      push,
    };
  },
};

export default component;
