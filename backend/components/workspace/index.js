import WorkspaceModel from "./model.js";
import User from "#components/user/index.js";
import UserModel from "#components/user/model.js";
import Workspace from "#components/workspace/model.js";
import Events from "#components/events/index.js";
import EventModel from "#components/events/model.js";
import Invoice from "#components/invoice/index.js";
import Metric from "#components/metric/index.js";
import InvoiceModel from "#components/invoice/model.js";

import prisma from "#lib/prisma.js";
import prismaTimeout from "#lib/prisma-timeout.js";
import config from "#lib/config.js";
import generateCost from "@operational.co/lib/generate-cost.js";
import generateJwt from "#lib/generate-jwt.js";

import Pdf from "#services/pdf/index.js";
import Key from "#services/key/index.js";
import Email from "#services/email/index.js";
import Billing from "#services/billing/index.js";
import Session from "#services/session/index.js";
import { customAlphabet } from "nanoid";
import ops from "#lib/ops.js";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 24);

import moment from "moment";

const component = {
  async removeExpiringInvites() {
    try {
      const durationDays = config.rules.INVITATION_DURATION;
      const cutoff = moment().subtract(durationDays, "days").toDate();

      // 1. Fetch all expired invites
      const expiredInvites = await prisma.invite.findMany({
        where: { createdAt: { lt: cutoff } },
      });

      // 2. Delete them in bulk
      if (expiredInvites.length > 0) {
        await prisma.invite.deleteMany({
          where: { createdAt: { lt: cutoff } },
        });
      }

      console.log(
        `[Invites] Removed ${expiredInvites.length} invites older than ${cutoff.toISOString()}`,
      );
      // 3. Return the list of removed invites
      return expiredInvites;
    } catch (error) {
      console.error("removeExpiringInvites error:", error);
      throw error;
    }
  },

  async invite(form, adminUserId, workspaceId) {
    try {
      // 1. Grab admin user (for email “from”)
      const adminUser = await prisma.user.findUnique({
        where: { id: adminUserId },
      });

      // 2. Generate invite code + link
      const code = nanoid();
      const link = `${config.appUrl}?invite=${code}`;

      // 3. Try to find existing user by email
      const existing = await prisma.user.findMany({
        where: { email: form.email },
      });

      let user;
      if (existing.length > 0) {
        // 3a. Pick the first and mark INVITED
        user = existing[0];

        const isAlreadyInWorkspace = await prisma.workspaceUser.findUnique({
          where: {
            userId_workspaceId: {
              userId: user.id,
              workspaceId,
            },
          },
        });

        if (isAlreadyInWorkspace) {
          throw `User is already a member of this workspace.`;
        }

        user = await prisma.user.update({
          where: { id: user.id },
          data: { status: "INVITED" },
        });
      } else {
        // 3b. Create brand-new user
        user = await prisma.user.create({
          data: {
            firstName: form.firstName,
            email: form.email,
            status: "INVITED",
          },
        });
      }

      // 4. Record the invitation in its own table
      await prisma.invite.create({
        data: {
          code,
          user: { connect: { id: user.id } },
          workspace: { connect: { id: workspaceId } },
        },
      });

      // 5. (Optional) Add them to the workspace immediately
      await prisma.workspaceUser.create({
        data: {
          workspace: { connect: { id: workspaceId } },
          user: { connect: { id: user.id } },
        },
      });

      // 6. Send the actual email
      await Email.inviteUser(user, adminUser, link);

      // 6a. Also send the admin user a mail
      await Email.informAdminAboutInvitee(adminUser, user);

      // 7. Return the current members of the workspace
      const users = await prisma.$queryRawUnsafe(
        `
          SELECT
            u.id, u.firstName, u.lastName, u.email, u.status, u.avatar
          FROM
            WorkspaceUser wu
          JOIN
            User u ON wu.userId = u.id
          WHERE
            wu.workspaceId = ?
        `,
        workspaceId,
      );

      return users;
    } catch (err) {
      console.error("invite error:", err);
      throw err;
    }
  },

  async checkInvite(form) {
    try {
      const { inviteCode } = form;

      // Find the invite and include its related user
      const invite = await prisma.invite.findFirst({
        where: { code: inviteCode },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              avatar: true,
            },
          },
          workspace: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // If no invite, return null; otherwise return the user object
      return invite ? { user: invite.user, workspace: invite.workspace } : null;
    } catch (error) {
      console.error("checkInvite error:", error);
      throw error;
    }
  },

  async acceptInvite(form) {
    const { inviteCode, firstName, lastName, password } = form;

    try {
      // 1. Fetch the invite, including its user & workspace
      const invite = await prisma.invite.findFirst({
        where: { code: inviteCode },
        include: {
          user: true,
          workspace: true,
        },
      });
      if (!invite) {
        throw new Error(`Invalid invite code`);
      }

      const { id: inviteId, user: invitedUser, workspace } = invite;

      // 2. In a single transaction:
      //    a) Update the user’s profile & status
      //    b) Ensure the WorkspaceUser pivot exists (upsert)
      //    c) Delete the consumed invite record
      const [updatedUser] = await prisma.$transaction([
        // a) mark them active and record their name
        prisma.user.update({
          where: { id: invitedUser.id },
          data: {
            firstName,
            lastName,
            status: "NORMAL",
            activated: true,
            primaryWorkspace: workspace.id,
          },
        }),
        // b) create the workspace-user link if missing
        prisma.workspaceUser.upsert({
          where: {
            userId_workspaceId: {
              userId: invitedUser.id,
              workspaceId: workspace.id,
            },
          },
          create: {
            user: { connect: { id: invitedUser.id } },
            workspace: { connect: { id: workspace.id } },
          },
          update: {}, // nothing to change if it already exists
        }),
        // c) remove the invite so it can’t be reused
        prisma.invite.delete({
          where: { id: inviteId },
        }),
      ]);

      const data = await User.acceptInvite(updatedUser, {
        password: password,
      }).catch((err) => {
        console.log(err);
      });

      console.log(data);

      // 3. Return the now-activated user (and you could also return workspace.id if needed)
      return data;
    } catch (error) {
      console.error("acceptInvite error:", error);
      throw error;
    }
  },

  async removeUser(form, adminUserId, workspaceId) {
    const userId = form.userId;

    // 1. Ensure the target user exists
    const userToBeDeleted = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToBeDeleted) {
      throw new Error(`User with id=${userId} not found`);
    }

    // 2. Load the workspace and verify permissions
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { adminId: true },
    });
    if (!workspace) {
      throw new Error(`Workspace with id=${workspaceId} not found`);
    }
    if (workspace.adminId !== adminUserId) {
      throw new Error(`Only the workspace owner may remove users`);
    }
    if (workspace.adminId === userId) {
      throw new Error(`Cannot remove the workspace owner`);
    }

    // 3. In one transaction, delete both the pivot and any invite
    await prisma.$transaction([
      prisma.workspaceUser.delete({
        where: {
          userId_workspaceId: { userId, workspaceId },
        },
      }),
      prisma.invite.deleteMany({
        where: { userId, workspaceId },
      }),
    ]);

    // 4. Return the updated list of workspace members
    const users = await prisma.$queryRawUnsafe(
      `
      SELECT 
        u.id,
        u.firstName,
        u.lastName,
        u.email,
        u.status,
        u.avatar
      FROM 
        WorkspaceUser wu
      INNER JOIN 
        User u ON wu.userId = u.id
      WHERE 
        wu.workspaceId = ?
    `,
      workspaceId,
    );

    return users;
  },

  async activate(form) {
    let code = form.code;
    let users = await UserModel.client.findMany({
      where: {
        activationCode: code,
      },
    });

    if (!users) {
      throw "Invalid code";
    }

    if (users.length === 0) {
      throw "Invalid code";
    }

    const user = users[0];

    const newUser = await UserModel.client.update({
      where: {
        id: user.id,
      },
      data: {
        activated: true,
        activationCode: null,
        onboardingStep: "intro",
      },
    });

    let e = {
      name: `user activated and email verified`,
      category: `user`,
      contextId: `user-signup-${user.id}`,
    };

    await ops.events.ingest(e);

    return newUser;
  },

  async update(form) {
    let workspace = await Workspace.update(form);

    return workspace;
  },

  async create(form) {
    let workspace = await Workspace.client.create({
      data: {
        name: form.name,
        status: "NORMAL",
      },
    });
    let workspaceUser = await prisma.workspaceUser.create({
      data: {
        role: "ADMIN",
        userId: form.userId,
        workspaceId: workspace.id,
        notify: true,
      },
    });

    // then generate api key
    const apikey = await Key.generate(workspace.id, "Default key - created on signup").catch(
      (err) => {
        // log something here
      },
    );

    let sessions = await prisma.session.findMany({
      where: {
        userId: form.userId,
      },
    });

    for (let i = 0; i < sessions.length; i++) {
      let session = sessions[i];
      await Session.invalidate(session.sid);
    }

    const user = await prisma.User.update({
      where: {
        id: form.userId,
      },
      data: {
        primaryWorkspace: workspace.id,
      },
    });

    let session = await Session.generate(user);

    const jwt = generateJwt(session.sid);

    await Key.buildCache();

    // then email user
    await Email.onNewWorkspace(form.userId, workspace);

    return jwt;
  },

  /**
   * Generates a cache of event names for all workspaces
   */
  async generateEventNames() {
    let workspaces = await WorkspaceModel.client.findMany({
      where: {},
    });

    for (let i = 0; i < workspaces.length; i++) {
      let workspace = workspaces[i];

      let eventNames = await Events.generateCommonEventNames(workspace.id);

      if (eventNames.length > 0) {
        await WorkspaceModel.update({
          id: workspace.id,
          eventNames,
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  },

  /**
   * Create an invoice
   * - Check if first invoice, and if yes, has it gone over 10,000
   * - If no, return
   * - If yes, continue
   * - Generate invoice period
   * - Generate event quantity
   * - Attach the workspaceId
   * - Attach the current prices
   * - Attach current events
   * - Attach the total price
   * - Set status to open
   */
  async createWorkspaceInvoice(workspace) {
    let invoices = workspace.invoices || [];

    if (!invoices[0]) {
      // check current events
    }

    let len = invoices.length + 1;

    let eventQuantity = 27000;

    const paddedNumber = String(len).padStart(4, "0");

    let code = `INV-${workspace.id}-${paddedNumber}`;

    let { periodStart, periodEnd } = await Invoice.calculateBillingPeriod(workspace.invoices);

    let cost = 199.0;

    let subTotal = 199.0;

    let total = 199.0;

    let lineItems = [
      {
        description: `Operational events(${eventQuantity} events logged), ${periodStart} - ${periodEnd}`,
        amount: `$${cost}`,
      },
    ];

    let invoice = {
      code,
      lineItems,
      subTotal,
      total,
      periodStart,
      periodEnd,
      workspaceId: workspace.id,
      status: "OPEN",
    };

    invoice = await InvoiceModel.client
      .create({
        data: invoice,
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * Godfunction to bill users every month
   * @returns
   */
  async billUsers() {
    // don't run if selfhosted
    if (config.SELFHOSTED) {
      return;
    }

    // first, get workspaces
    let workspaces = await WorkspaceModel.client.findMany({
      where: {
        status: "NORMAL",
      },
      include: {
        invoices: true,
        coupons: true,
      },
    });
    console.log(`workspaces: ${workspaces.length}`);

    /**
     * Check for recurring billing
     */
    for (let i = 0; i < workspaces.length; i++) {
      let workspace = workspaces[i];

      await this.computeWorkspaceBilling(workspace);
    }

    /**
     * Then bill invoices
     */
    await Billing.billInvoices();
  },

  /**
   * Main function to bill workspace
   */
  async computeWorkspaceBilling(workspace) {
    let e = {
      name: `billing workspace`,
      category: `billing`,
      type: "json",
      content: workspace,
    };
    await ops.events.ingest(e);

    const month = 4;
    const year = 2025;
    const metric = await Metric.getByWorkspaceMonthYear(workspace.id, month, year);
    console.log(metric);
    if (!metric) {
      console.log(`Workspace ${workspace.name}:${workspace.id} has no previous month's metrics`);
      return;
    }

    // Events generated by the workspace for last month
    let totalEventsLastMonth = metric.events;

    // Events this workspace will be charged for. Defaults to 0
    let billableEvents = 0;

    // Free events left(free 10,000) from previous months calculation
    let freeEventsLeft = Math.max(workspace.freeEvents - workspace.usedFreeEvents, 0);

    console.log(`totalEventsLastMonth: ${totalEventsLastMonth}`);
    console.log(`billableEvents: ${billableEvents}`);
    console.log(`usedFreeEvents: ${workspace.usedFreeEvents}`);

    console.log("--- calculating ---");

    if (freeEventsLeft > 0) {
      if (totalEventsLastMonth >= freeEventsLeft) {
        billableEvents = totalEventsLastMonth - freeEventsLeft;
        workspace.usedFreeEvents = workspace.freeEvents;
      } else {
        billableEvents = 0;
        workspace.usedFreeEvents += totalEventsLastMonth;
      }
    } else {
      billableEvents = totalEventsLastMonth;
    }

    console.log(`totalEventsLastMonth: ${totalEventsLastMonth}`);
    console.log(`billableEvents: ${billableEvents}`);
    console.log(`usedFreeEvents: ${workspace.usedFreeEvents}`);

    /**
     * This bit is for voiding the invoice if 1000 or less events were logged for last month
     */
    let invoice = null;
    try {
      if (billableEvents <= 1000) {
        invoice = await Invoice.generateWorkspaceInvoice(workspace, metric, billableEvents, true);
        // create voided invoice
      } else {
        invoice = await Invoice.generateWorkspaceInvoice(workspace, metric, billableEvents);
        // create normal invoice
      }
      await WorkspaceModel.update({
        id: workspace.id,
        usedFreeEvents: workspace.usedFreeEvents,
      });
    } catch (err) {
      console.log(err);
    }

    console.log(invoice);
  },

  async calculateMetrics() {
    const workspaces = await prisma.workspace.findMany({
      where: {
        status: {
          in: ["NORMAL", "DEMO"],
        },
      },
    });

    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];

      const metric = await Metric.calculateMetric(workspace.id);
    }
  },

  async recomputeCategories() {
    // 1. Fetch all workspaceIds that need recomputing
    const workspaces = await prisma.$queryRawUnsafe(`
			SELECT workspaceId FROM CategoryRecomputeQueue
		`);

    if (workspaces.length === 0) {
      // Nothing to do
      return;
    }

    for (const { workspaceId } of workspaces) {
      try {
        // 2. Fetch distinct categories from ClickHouse for this workspace
        const categories = await EventModel.getCategories({
          limit: 100,
          workspaceId,
        });

        const categoryTexts = categories.map((row) => row.category);

        if (categoryTexts.length === 0) {
          // No categories, just remove from queue
          await prisma.$executeRawUnsafe(
            `
						DELETE FROM CategoryRecomputeQueue
						WHERE workspaceId = ?
					`,
            workspaceId,
          );
          continue;
        }

        // 3. Fetch existing categories from MySQL
        const existing = await prisma.$queryRawUnsafe(
          `
					SELECT text FROM Category
					WHERE workspaceId = ?
				`,
          workspaceId,
        );

        const existingTexts = new Set(existing.map((row) => row.text));

        // 4. Find only new categories
        const newCategories = categoryTexts.filter((text) => !existingTexts.has(text));

        if (newCategories.length > 0) {
          // 5. Insert new categories
          await prisma.$executeRawUnsafe(
            `
						INSERT INTO Category (workspaceId, text)
						VALUES ${newCategories.map(() => "(?, ?)").join(", ")}
						ON DUPLICATE KEY UPDATE text = text
					`,
            ...newCategories.flatMap((text) => [workspaceId, text]),
          );
        }

        // 6. Remove from recompute queue
        await prisma.$executeRawUnsafe(
          `
					DELETE FROM CategoryRecomputeQueue
					WHERE workspaceId = ?
				`,
          workspaceId,
        );
      } catch (err) {
        console.error("Failed to recompute categories for workspace", workspaceId, err);
      }
    }
  },

  async deactivateWorkspaces() {
    // temp - once we move to the paid version, we'll set this
    return;
    const workspaces = await prisma.workspace.findMany({
      where: {
        usedFreeEvents: {
          gte: prisma.workspace.fields.freeEvents,
        },
        status: {
          in: ["NORMAL"],
        },
      },
    });

    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];

      await this.toDeactivate(workspace.id);
    }
  },

  async toDeactivate(workspaceId) {
    let data = {
      id: workspaceId,
      status: "DEACTIVATED",
      holdAt: null,
    };

    const workspace = await WorkspaceModel.update(data);

    await Billing.cancelSetupIntents(workspace.customerId);

    await Email.onWorkspaceDeactivated(workspace);
  },

  async sendLifecycleEmails() {
    if (config.SELFHOSTED) {
      return;
    }
    const workspaces = await prisma.workspace.findMany({
      where: {
        status: {
          in: ["NORMAL"],
        },
        holdAt: {
          not: null,
        },
      },
    });

    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];

      const emailFlags = workspace.emailFlags || {};

      if (!emailFlags.informEventsAt) {
        await Email.onWorkspaceInformEvents(workspace);

        emailFlags.informEventsAt = moment.utc().toISOString();

        await WorkspaceModel.update({
          id: workspace.id,
          emailFlags,
        });
      }
    }
  },

  async calculateUsedFreeEvents() {
    if (config.SELFHOSTED) {
      return;
    }
    const workspaces = await prisma.workspace.findMany({
      where: {
        usedFreeEvents: {
          lt: prisma.workspace.fields.freeEvents,
        },
      },
    });

    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];

      // get all metrics for said workspace
      const metrics = await Metric.getAllMetrics(workspace.id);

      let totalEvents = 0;

      for (let j = 0; j < metrics.length; j++) {
        const metric = metrics[j];

        totalEvents = totalEvents + metric.events;
      }

      if (totalEvents > 0) {
        const payload = {
          id: workspace.id,
          usedFreeEvents: totalEvents,
        };

        const updatedWorkspace = await WorkspaceModel.update(payload);

        // Only nag if payment details aren't entered
        if (!workspace.paymentStartedAt) {
          await this.nagWorkspace(updatedWorkspace);
        }
      }
    }

    await this.deactivateWorkspaces();
  },

  async nagWorkspace(workspace) {
    const emailFlags = workspace.emailFlags || {};

    let percentageDifference =
      ((workspace.freeEvents - workspace.usedFreeEvents) / workspace.freeEvents) * 100;

    percentageDifference = 100 - percentageDifference;

    percentageDifference = Math.ceil(percentageDifference);

    if (percentageDifference >= 50 && !emailFlags.nag50) {
      // nag for 50%
      await Email.sendNagEmail(workspace, 50);
      emailFlags.nag50 = true;
      let payload = {
        id: workspace.id,
        emailFlags,
      };
      await WorkspaceModel.update(payload);
    }

    if (percentageDifference > 75 && !emailFlags.nag75) {
      // nag for 75%
      await Email.sendNagEmail(workspace, 75);
      emailFlags.nag75 = true;
      let payload = {
        id: workspace.id,
        emailFlags,
      };
      await WorkspaceModel.update(payload);
    }

    if (percentageDifference > 95 && !emailFlags.nag95) {
      // nag for 95%
      await Email.sendNagEmail(workspace, 95);
      emailFlags.nag95 = true;
      let payload = {
        id: workspace.id,
        emailFlags,
      };
      await WorkspaceModel.update(payload);
    }
  },
};

export default component;
