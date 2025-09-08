import express from "express";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";
import component from "./index.js";
import config from "#lib/config.js";

// Create a new router instance
const router = express.Router();

const get = async (req, res) => {
  let params = {};

  params.workspaceId = res.locals.user.primaryWorkspace;

  const dashboard = await component.find(params).catch((err) => {
    throw err;
  });

  return res.send(dashboard);
};

const updateWidgets = async (req, res) => {
  console.log(req.body);

  let params = {
    widgets: [...req.body],
  };

  params.workspaceId = res.locals.user.primaryWorkspace;
  params.dashboardId = parseInt(req.params.id);

  try {
    const dashboard = await component.updateWidgets(params);
    return res.send(dashboard);
  } catch (err) {
    return res.status(400).send(err);
  }
};

const createWidget = async (req, res) => {
  try {
    const widget = await component.createWidget(req.body);
    return res.send(widget);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const deleteWidget = async (req, res) => {
  let params = {
    dashboardId: parseInt(req.params.id),
    widgetId: parseInt(req.params.widgetId),
    workspaceId: parseInt(res.locals.user.primaryWorkspace),
  };

  console.log(params);

  try {
    const widget = await component.deleteWidget(params);
    return res.send(widget);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const runWidgetAction = async (req, res) => {
  let params = {
    dashboardId: parseInt(req.params.id),
    widgetId: parseInt(req.params.widgetId),
    workspaceId: parseInt(res.locals.user.primaryWorkspace),
  };

  try {
    const widget = await component.runWidgetAction(params);
    return res.send(widget);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const getSchema = {
  schema: {},
};

const updateWidgetsSchema = {
  schema: {
    x: {
      type: "number",
      default: 0,
    },
    y: {
      type: "number",
      default: 0,
    },
  },
};

const createWidgetSchema = {
  schema: {
    x: {
      type: "number",
      default: 0,
    },
    y: {
      type: "number",
      default: 0,
    },
    w: {
      type: "number",
      default: 1,
    },
    h: {
      type: "number",
      default: 1,
    },
    type: {
      type: "string",
    },
    schema: {
      type: "object",
    },
    dashboardId: {
      type: "number",
      convert: true,
    },
  },
};

router.get("/", middlewareAuth, middlewareSchema(getSchema), get);

router.put("/:id/widgets", middlewareAuth, middlewareSchema(updateWidgetsSchema), updateWidgets);

router.post("/:id/widgets", middlewareAuth, middlewareSchema(createWidgetSchema), createWidget);

router.delete("/:id/widgets/:widgetId", middlewareAuth, deleteWidget);

router.post("/:id/widgets/:widgetId/action", middlewareAuth, runWidgetAction);

// Export the router
export default router;
