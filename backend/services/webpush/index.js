import webpush from "web-push";
import UserModel from "#components/user/model.js";
import WorkspaceModel from "#components/workspace/model.js";
import prisma from "#lib/prisma.js";
import config from "#lib/config.js";

class Webpush {
  push;

  constructor() {}

  async setup() {
    if (config.vapid.EMAIL && config.vapid.PUBLIC_KEY && config.vapid.PRIVATE_KEY) {
      webpush.setVapidDetails(
        config.vapid.EMAIL,
        config.vapid.PUBLIC_KEY,
        config.vapid.PRIVATE_KEY,
      );

      this.push = webpush;
    } else {
      console.log(
        "ERROR - Missing VAPID details. Please ensure config.vapid.EMAIL, config.vapid.PUBLIC_KEY, and config.vapid.PRIVATE_KEY are all set.",
      );

      this.push = null;
    }
  }

  async test() {
    let status = "inactive";
    let type = null;
    let info = `Not set. Push notifications won't work`;
    if (config.vapid.EMAIL && config.vapid.PUBLIC_KEY && config.vapid.PRIVATE_KEY) {
      type = "vapid";
      info = "";
      status = "active";
    }

    return {
      name: "webpush",
      value: this.dbName,
      status: status,
      info: info,
    };
  }

  getUniqueSubscriptions(subscriptions) {
    const seenAuths = new Set();
    return subscriptions.filter((sub) => {
      if (!sub.keys || !sub.keys.auth) return false; // Skip if no auth key
      if (seenAuths.has(sub.keys.auth)) return false; // Skip duplicates
      seenAuths.add(sub.keys.auth);
      return true; // Keep unique items
    });
  }

  async sendEventNotification(event) {
    //console.log(event);
    let notifiers = event._notifiers || [];

    if (notifiers.length === 0) {
      return;
    }

    // this can be optimized by caching
    const sql = `
			SELECT 
    wu.userId,
    JSON_ARRAYAGG(p.pushSubscription) AS pushSubscriptions,
    wu.notify
FROM WorkspaceUser wu
JOIN User u ON wu.userId = u.id
JOIN Push p ON u.id = p.userId
WHERE wu.userId IN (${notifiers.join(",")})
GROUP BY wu.userId, wu.notify;
		`;

    const users = await prisma.$queryRawUnsafe(sql).catch((err) => {
      console.log(err);

      return;
    });

    if (!users) {
      return;
    }

    for (let i = 0; i < users.length; i++) {
      let user = users[i];

      if (!user.pushSubscriptions) {
        continue;
      }

      if (!user.notify) {
        continue;
      }

      if (user.notify == 0) {
        continue;
      }

      let subs = user.pushSubscriptions || [];

      if (typeof subs === "string") {
        try {
          subs = JSON.parse(subs);
        } catch (err) {
          console.error("Invalid JSON for pushSubscriptions:", err);
          subs = [];
        }
      }

      try {
        user.pushSubscriptions = this.getUniqueSubscriptions(subs);
      } catch (err) {
        console.log(err);
        console.log("--- ERROR ---");
        console.log(subs);
        user.pushSubscriptions = [];
      }

      let message = {
        id: event.id,
        workspaceId: event.workspaceId,
        message: event.searchable,
      };

      message = JSON.stringify(message);

      for (let i = 0; i < user.pushSubscriptions.length; i++) {
        const push = user.pushSubscriptions[i];

        await this.sendNotification(push.endpoint, push.keys, message).catch((err) => {});
      }
    }
  }

  async sendNotification(endpoint, keys, message = "") {
    const pushSubscription = {
      endpoint,
      keys,
    };

    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    const options = {
      TTL: 3600,
    };

    if (!this.push) {
      throw "Webpush not setup";
    }

    const res = await this.push
      .sendNotification(pushSubscription, message, options)
      .catch((err) => {
        //console.log(err);
        throw err;
      });
  }
}

export default new Webpush();
