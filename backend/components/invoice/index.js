import Pdf from "#services/pdf/index.js";
import Model from "./model.js";
import config from "#lib/config.js";
import generateCost from "@operational.co/lib/generate-cost.js";
import moment from "moment";
import prisma from "#lib/prisma.js";

const component = {
  async calculateBillingPeriod(invoices) {
    let periodStart = null;
    let periodEnd = null;

    let currentDate = moment.utc();
    currentDate = currentDate.startOf("day");
    currentDate = currentDate.startOf("month");

    periodEnd = currentDate.format("YYYY-MM-DD HH:mm:ss");

    currentDate = currentDate.subtract(1, "month");

    // If invoices are present, get the start date from the periodEnd date of the latest invoice
    if (invoices && invoices.length > 0) {
      periodStart = invoices[invoices.length - 1].periodEnd;

      periodStart = moment(periodStart).utc();

      periodStart = periodStart.format("YYYY-MM-DD HH:mm:ss");
    } else {
      // Get invoices by subtracting 1 month

      periodStart = currentDate.format("YYYY-MM-DD HH:mm:ss");
    }

    return {
      periodStart,
      periodEnd,
    };
  },

  // will be depreciated soon
  /*
  async generateInvoice(workspace) {
    try {
      let invoices = workspace.invoices || [];

      let { periodStart, periodEnd } = await this.calculateBillingPeriod(invoices);

      let eventQuantity = await Events.getEventsCountPerBillingCycle(workspace.id, {
        periodStart,
        periodEnd,
      });

      console.log(eventQuantity);

      if (!invoices[0]) {
        // check current events
      }

      let costData = await generateCost(config.prices.eventScales, eventQuantity);

      let cost = costData.cost;

      let total = cost;
      let subTotal = cost;

      let len = invoices.length + 1;

      const paddedNumber = String(len).padStart(4, "0");

      let code = `INV-${workspace.id}-${paddedNumber}`;

      let lineItems = [
        {
          description: `Operational events(${eventQuantity} events logged), ${periodStart} - ${periodEnd}`,
          amount: `$${cost}`,
        },
      ];

      periodStart = moment(periodStart, "YYYY-MM-DD HH:mm:ss").utc().toISOString();
      periodEnd = moment(periodEnd, "YYYY-MM-DD HH:mm:ss").utc().toISOString();

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

      invoice = await Model.client
        .create({
          data: invoice,
        })
        .catch((err) => {
          console.log(err);
        });

      return invoice;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  */

  generateInvoiceCode(invoices, workspaceId) {
    let len = invoices.length + 1;
    const paddedNumber = String(len).padStart(4, "0");
    let code = `INV-${workspaceId}-${paddedNumber}`;

    return code;
  },

  async generateWorkspaceInvoice(workspace, metric, billableEvents = 0, voided = false) {
    try {
      let code = this.generateInvoiceCode(workspace.invoices, workspace.id);

      let periodStart = moment()
        .set({ year: metric.year, month: metric.month, date: 1 })
        .format("YYYY-MM-DD HH:mm:ss");
      let periodEnd = moment()
        .set({ year: metric.year, month: metric.month + 1, date: 1 })
        .format("YYYY-MM-DD HH:mm:ss");

      let existingInvoices = await Model.client.findMany({
        where: {
          workspaceId: workspace.id,
          periodStart: moment(periodStart, "YYYY-MM-DD HH:mm:ss")
            .startOf("day")
            .utc()
            .toISOString(),
        },
      });

      if (existingInvoices.length > 0) {
        throw new Error(`Invoice already exists`);
      }

      let eventQuantity = billableEvents;

      let costData = await generateCost(config.prices.eventScales, eventQuantity);

      let cost = costData.cost;

      let total = cost;
      let subTotal = cost;

      let description = "";

      if (costData.eventsCount) {
        console.group("creating line item description");
        costData.eventsCount.map((count) => {
          description = `${description}${count.count} x $${count.rate},`;
        });
      }

      let lineItems = [
        {
          name: `Operational Events`,
          description: description,
          quantity: eventQuantity,
          amount: `$${cost}`,
        },
      ];

      periodStart = moment(periodStart, "YYYY-MM-DD HH:mm:ss").startOf("day").utc().toISOString();
      periodEnd = moment(periodEnd, "YYYY-MM-DD HH:mm:ss").startOf("day").utc().toISOString();

      let status = "OPEN";

      if (voided) {
        status = "VOID";
      }

      let invoice = {
        code,
        lineItems,
        subTotal,
        total,
        periodStart,
        periodEnd,
        workspaceId: workspace.id,
        status: status,
      };

      invoice = await Model.client
        .create({
          data: invoice,
        })
        .catch((err) => {
          console.log(err);
        });

      return invoice;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async findByWorkspaceId(id) {
    return await Model.findByWorkspaceId(id);
  },

  async download(invoiceId, res) {
    console.log("gathering data");
    const invoice = await Model.findById(invoiceId);

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: invoice.workspaceId,
      },
      include: {
        users: true,
      },
    });

    let admin = null;
    for (let i = 0; i < workspace.users.length; i++) {
      const user = workspace.users[i];
      if (user.role === "ADMIN") {
        admin = user;
        break;
      }
    }
    workspace.admin = admin;

    console.log("creating pdf");

    await Pdf.createInvoice(workspace, invoice, res);
  },
};

export default component;
