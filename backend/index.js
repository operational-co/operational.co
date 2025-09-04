import "dotenv/config";

import http from "http";

import Clickhouse from "#services/clickhouse/index.js";
import Webpush from "#services/webpush/index.js";
import Pdf from "#services/pdf/index.js";
import Storage from "#services/storage/index.js";
import Key from "#services/key/index.js";
import Ingestion from "#services/ingestion/index.js";
import Email from "#services/email/index.js";
import Cron from "#services/cron/index.js";
import Db from "#services/db/index.js";
import Session from "#services/session/index.js";
import Billing from "#services/billing/index.js";
import Demo from "#services/demo/index.js";
import Internal from "#services/internal/index.js";

import apiRoutes from "#components/api/routes.js";
import eventsRoutes from "#components/events/routes.js";
import userRoutes from "#components/user/routes.js";
import workspaceRoutes from "#components/workspace/routes.js";
import websiteRoutes from "#components/website/routes.js";
import metricRoutes from "#components/metric/routes.js";
import invoiceRoutes from "#components/invoice/routes.js";
import dashboardsRoutes from "#components/dashboards/routes.js";

import User from "#components/user/index.js";
import UserModel from "#components/user/model.js";
import Workspace from "#components/workspace/index.js";
import Events from "#components/events/index.js";
import config from "#lib/config.js";
import UserComponent from "#components/user/index.js";
import MetricComponent from "#components/metric/index.js";
import Website from "#components/website/index.js";

import loggerMiddleware from "#components/middleware/logger.js";

import express from "express";
import path from "path";

import ops from "#lib/ops.js";
import modifyConsoleLog from "#lib/modify-console-log.js";

modifyConsoleLog();

const __dirname = path.resolve("");
const app = express();

async function runExperiments() {
  await ops.log(`avatar:🤖 Server started`);

  await Workspace.recomputeCategories();

  //await Workspace.billUsers();

  //await Website.getStats();
}

async function preInit() {
  await Promise.all([
    await Clickhouse.setup(),
    await Db.setup(),
    await Webpush.setup(),
    await Pdf.setup(),
    await Storage.setup(),
    await Key.setup(),
    await Ingestion.setup(),
    await Email.setup(),
    await Cron.setup(),
    await Session.setup(),
    await Billing.setup(),
    await Demo.setup(),
    await Internal.setup(),
  ]);

  runExperiments();

  //await Ingestion.testIngest();

  //await ch.migrate();
}

async function init() {
  await preInit();

  await setupServer();
}

async function setupServer() {
  const corsMiddleware = (req, res, next) => {
    let allowAll = false;
    let valids = ["http://localhost:8080", "https://app.operational.co"];

    // Only set this for selfhosted
    if (config.SELFHOSTED) {
      valids = [config.CORS];
      if (config.CORS === "*") {
        allowAll = true;
      }
    }
    const allowedPaths = ["/api/v1/ingest", "/api/v1/log"];

    const origin = req.headers.origin;

    // If allowAll is set, just allow all requests
    if (allowAll) {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-token, x-test");
      res.setHeader("Access-Control-Expose-Headers", "Content-Range, x-token, x-test");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      // Handle preflight (OPTIONS) requests
      if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        return res.sendStatus(204);
      }

      return next();
    }

    // Allow requests if:
    // 1. No origin (server-to-server, Postman, curl)
    // 2. Origin is in the allowed list
    // 3. The request path is in the allowed list
    if (!origin || valids.includes(origin) || allowedPaths.includes(req.path)) {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-token, x-test");
      res.setHeader("Access-Control-Expose-Headers", "Content-Range, x-token, x-test");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      // Handle preflight (OPTIONS) requests
      if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        return res.sendStatus(204);
      }
    } else {
      return res.status(403).json({
        error: "Not allowed by CORS",
      });
    }

    next();
  };

  app.disable("x-powered-by");

  app.use(corsMiddleware);

  app.use(
    express.json({
      limit: "100kb",
    }),
  );

  app.use(
    express.urlencoded({
      limit: "50kb",
      extended: true,
    }),
  );

  app.use(
    express.text({
      limit: "10kb",
    }),
  );

  app.use(loggerMiddleware);

  app.use("/api/v1", apiRoutes);

  app.use("/events", eventsRoutes);

  app.use("/user", userRoutes);

  app.use("/workspace", workspaceRoutes);

  app.use("/website", websiteRoutes);

  app.use("/metric", metricRoutes);

  app.use("/invoice", invoiceRoutes);

  app.use("/dashboards", dashboardsRoutes);

  // Define the path to the uploads directory
  const uploadDir = path.join(__dirname, "public/uploads");

  if (config.env === "development") {
    app.use("/uploads", express.static(uploadDir));
  }

  // healthcheck
  app.get("/", (req, res) => {
    return res.sendStatus(200);
  });

  app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging

    // Set the response status and message
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  });

  const server = http.createServer(app);

  // Run the server!
  try {
    app.listen({
      port: config.PORT,
      host: config.HOST,
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  // depreciated - might resurrect this in the future
  const gracefulShutdown = async () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0); // Exit process
    });
  };
  //process.on("SIGINT", gracefulShutdown);
  //process.on("SIGTERM", gracefulShutdown);

  process.on("SIGTERM", function () {
    process.exit(0);
  });

  process.on("SIGINT", function () {
    process.exit(0);
  });

  // process.on("exit", (code, e) => {
  //  console.log(code);
  //  console.log(e);
  //  process.exit(0);
  // });
}

init();
