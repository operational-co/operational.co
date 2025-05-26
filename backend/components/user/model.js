import prisma from "#lib/prisma.js";
import prismaWrap from "#lib/prisma-wrap.js";
import Model from "#lib/class-model.js";
import WorkspaceModel from "#components/workspace/model.js";

import hashPassword from "#lib/hash-password.js";
import comparePassword from "#lib/compare-password.js";
import NodeCache from "node-cache";

class User extends Model {
  cache = new NodeCache({
    stdTTL: 30, // Really really small duration. Cache is only used to exclusively speed up middleware/auth.js resolves
    checkPeriod: 120,
  });

  // note that the result doens't match with the getPie
  async findById(userId, cache = false) {
    // Use a cache for smaller quicker resolves(eg, middleware/auth.js)
    if (cache) {
      let temp = this.cache.get(userId);
      if (temp) {
        return temp;
      }
    }
    let sql = `
		SELECT
			b.id,
			b.email,
			b.createdAt,
			b.primaryWorkspace,
			b.activated,
			b.onboarded,
			b.avatar,
			b.onboardingStep,
			b.activationCode
    FROM User b
		WHERE b.id = ${userId}
		LIMIT 1
		`;

    try {
      const users = await prisma.$queryRawUnsafe(sql);

      if (users && users.length > 0) {
        this.cache.set(userId, users[0]);
        return users[0];
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  async findByEmail(email) {
    let sql = `
		SELECT
			b.id,
			b.email,
			b.createdAt,
			b.workspaceId,
			b.pushSubscription,
			b.activated,
			b.onboarded,
			b.onboardingStep,
			b.notify,
			b.activationCode
    FROM User b
		WHERE b.email = "${email}"
		LIMIT 1
		`;

    try {
      const users = await prisma.$queryRawUnsafe(sql);

      if (users && users.length > 0) {
        return users[0];
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  async login(form, bypass = false) {
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

    if (bypass) {
      delete user.password;
      return user;
    }

    const condition = await comparePassword(password, user.password);

    if (!condition) {
      throw `Can't find any users with those login details`;
    }

    delete user.password;

    return user;
  }

  async update(resource) {
    let id = resource.id;

    let query = {
      where: {
        id: id,
      },
      data: resource,
      omit: {
        password: true,
        meta: true,
        resetPasswordToken: true,
      },
      include: {
        workspace: true,
      },
    };

    delete query.data.id;

    resource = await this.client.update(query).catch((err) => {
      this.captureException(err);

      throw err;
    });

    // workspace is actually workspaceUser
    const workspace = resource.workspace;

    let notify = false;
    let pushSubscription = null;

    // get the workspaceUser of the primary workspace
    for (let i = 0; i < workspace.length; i++) {
      const w = workspace[i];
      if (w.userId === resource.id && w.workspaceId === resource.primaryWorkspace) {
        notify = w.notify;
        pushSubscription = w.pushSubscription;

        break;
      }
    }

    resource.notify = notify;
    resource.pushSubscription = pushSubscription;

    delete resource.workspace;

    // then also get all workspaceUsers via a quick query
    const workspaceUsers = await prisma.$queryRawUnsafe(
      `SELECT w.id AS id, w.name AS name 
   FROM WorkspaceUser wu
   JOIN Workspace w ON wu.workspaceId = w.id
   WHERE wu.userId = ? AND wu.workspaceId = ?`,
      resource.id,
      resource.primaryWorkspace,
    );

    resource.workspaces = workspaceUsers;

    //resource = await this.findById(id);

    //this.afterWrite(resource);

    return resource;
  }

  async getPie(userId) {
    let arr = [
      "u.id",
      "u.email",
      "u.createdAt",
      "u.primaryWorkspace",
      "u.avatar",
      "u.firstName",
      "u.lastName",
      "u.activated",
      "u.onboarded",
      "u.onboardingStep",
      "u.activationCode",
      "u.settings",
      "u.status",
      "u.timezone",
      "wu.pushSubscription",
      "wu.notify",
    ];

    arr = arr.map((field) => {
      let key = field.split(".")[1];
      let str = `${field} AS user_${key}`;
      return str;
    });

    const sql = `
		SELECT
			${arr.join(",")},
			Workspace.*,
			(
				SELECT JSON_ARRAYAGG(
					JSON_OBJECT(
						'id', Apikey.id,
						'key', Apikey.key,
						'description', Apikey.description,
						'createdAt', Apikey.createdAt
					)
				)
				from Apikey
				WHERE Apikey.workspaceId = Workspace.id
			) AS apiKeys,
			(
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', AssociatedWorkspace.id,
                'name', AssociatedWorkspace.name
            )
        )
        FROM WorkspaceUser wua
        LEFT JOIN Workspace AssociatedWorkspace ON wua.workspaceId = AssociatedWorkspace.id
        WHERE wua.userId = u.id
    	) AS user_workspaces,
			(
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', Category.id,
                'text', Category.text
            )
        )
        FROM Category
        WHERE Category.workspaceId = Workspace.id
    	) AS workspace_categories,
		(
	        SELECT JSON_OBJECT(
	            'id', M.id,
	            'workspaceId', M.workspaceId,
	            'month', M.month,
	            'year', M.year,
				'events', M.events,
	            'createdAt', M.createdAt
	        )
	        FROM Metric M
	        WHERE M.workspaceId = Workspace.id
	        ORDER BY M.createdAt DESC
	        LIMIT 1
    	) AS workspace_metric,
      (
      SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
      'id', u2.id,
      'firstName', u2.firstName,
      'lastName', u2.lastName,
      'email', u2.email,
      'avatar', u2.avatar
      )
      )
      FROM WorkspaceUser wu2
      INNER JOIN User u2 ON u2.id = wu2.userId
      WHERE wu2.workspaceId = Workspace.id
      ) AS workspace_users
		FROM
			User u
		JOIN
			WorkspaceUser wu ON wu.userId = u.id AND wu.workspaceId = u.primaryWorkspace
		JOIN
			Workspace ON wu.workspaceId = Workspace.id
		LEFT JOIN
			Apikey ON Workspace.id = Apikey.workspaceId
		LEFT JOIN
			WorkspaceUser wua ON wua.userId = u.id -- Join to get all workspaces the user is associated with
		LEFT JOIN
			Workspace AssociatedWorkspace ON wua.workspaceId = AssociatedWorkspace.id -- Fetch the associated workspace details (id, name)
		WHERE
			u.id = ${userId}
			AND Workspace.id = u.primaryWorkspace
		GROUP BY
			u.id, Workspace.id
		`;

    let user = await prisma.$queryRawUnsafe(sql);

    if (!user) {
      return;
    }

    if (user.length === 0) {
      return;
    }

    let pie = user[0];

    try {
      pie = this.configurePie(pie);
    } catch (err) {
      console.log(err);
    }

    return pie;
  }

  configurePie(pie) {
    let user = {};
    let workspace = {};
    for (let key in pie) {
      let splits = key.split("_");

      if (!splits[1]) {
        workspace[key] = pie[key];
        continue;
      }

      if (splits[0] === "user") {
        user[splits[1]] = pie[key];
        continue;
      }

      if (splits[0] === "wu") {
        user[splits[1]] = pie[key];
      }
    }
    if (!user) {
      return;
    }
    if (!workspace) {
      return;
    }
    if (workspace.apiKeys) {
      workspace.keys = workspace.apiKeys;
      delete workspace.apiKeys;
    }
    if (pie.workspace_categories) {
      workspace.categories = pie.workspace_categories;
    }
    if (pie.workspace_metric) {
      workspace.metrics = [pie.workspace_metric];
    } else {
      workspace.metrics = [];
    }

    if (pie.workspace_users) {
      workspace.users = pie.workspace_users;
    }

    user.notify = !!user.notify;
    user.onboarded = !!user.onboarded;
    user.activated = !!user.activated;

    user.workspace = workspace;
    return user;
  }

  async signup(form, isSetup = false) {
    const email = form.email;
    const password = form.password;
    let projectName = "";

    if (isSetup) {
      // Specific to user.setup
      projectName = form.projectName || undefined;
      delete form.projectName;
      form.onboardingStep = "setup";
      form.activated = true;
    }

    const query = {
      where: {
        email: email,
      },
    };

    const userExistsResult = await prisma.$queryRawUnsafe(
      `SELECT EXISTS(SELECT 1 FROM User WHERE email = ?) AS userExists`,
      email,
    );

    const userExists = Boolean(Number(userExistsResult[0].userExists));

    //const users = await this.client.findMany(query);

    if (userExists.length > 0) {
      throw "Someone with this email already exists";
    }

    let hashedPassword = await hashPassword(password);

    let user = await this.client
      .create({
        data: {
          ...form,
          password: hashedPassword,
        },
      })
      .catch((err) => {
        throw err;
      });

    const workspace = await WorkspaceModel.signup(user, projectName, isSetup).catch((err) => {
      throw err;
    });

    const WorkspaceUser = await prisma.workspaceUser.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "ADMIN",
        notify: true,
      },
    });

    user = await this.client.update({
      where: {
        id: user.id,
      },
      data: {
        primaryWorkspace: workspace.id,
      },
    });

    return user;
  }

  async checkPassword(password, hash) {
    const condition = await comparePassword(password, hash);

    if (!condition) {
      return false;
    }

    return true;
  }

  async signPassword(password) {
    let hashedPassword = await hashPassword(password);

    return hashedPassword;
  }
}

export default new User("user", prisma);
