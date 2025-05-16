import express from "express";

import component from "./index.js";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";

import config from "#lib/config.js";

// Create a new router instance
const router = express.Router();

const login = async (req, res) => {
  let params = {};

  const testMode = req.headers["x-test"] || false;
  params.testMode = !!testMode;

  try {
    let event = await component.doAction(req.body.action, req.body.event, params);
    if (event.error) {
      res.status(400);
      return res.send(event);
    }

    if (event) {
      res.status(201);
      return res.send(event);
    } else {
      res.status(200);
      return res.send(null);
    }
  } catch (err) {
    // if (err && err.response) {
    // 	console.log(err.response.data);
    // }
    res.status(400);
    return res.send(err);
  }
};

const subscribe = async (req, res) => {
  const subscription = req.body;
  const user = res.locals.user;
  const sid = res.locals.sid;

  await component.subscribe(user, subscription, sid);

  if (res.locals.user) {
    res.status(200);
    res.send(res.locals.user);
  } else {
    res.status(401);
    res.send("Unauthorized");
  }
};

const headlessLogin = async (req, res) => {
  if (res.locals.user) {
    const pie = await model.getPie(res.locals.user.id);
    res.status(200);
    res.send(pie);
  } else {
    res.status(401);
    res.send("Unauthorized");
  }
};

const sendTestPushNotification = async (req, res) => {
  try {
    const pushSubscriptions = await component.sendTestPushNotification(res.locals.user.id);
    return res.status(200).send(pushSubscriptions);
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
};

const getStats = async (req, res) => {
  try {
    let stats = await component.getStats(res.locals.user.id);
    stats.services = await component.doTests();
    return res.status(200).send(stats);
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
};

const checkConnection = async (req, res) => {
  const selfHosted = config.SELFHOSTED;

  if (!selfHosted) {
    return res.sendStatus(404);
  }

  try {
    const connectionStats = await component.checkConnnection();
    return res.status(200).send(connectionStats);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: err,
    });
  }
};

const push = async (req, res) => {
  const userId = res.locals.user.id;

  try {
    const push = await component.getPush(userId);
    return res.status(200).send(push);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: err,
    });
  }
};

const loginSchema = {
  schema: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
};

const signupSchema = {
  schema: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    companyUrl: {
      type: "string",
    },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
    meta: {
      type: "object",
    },
  },
};

router.get("/stats", middlewareAuth, getStats);

router.post("/subscribe-push", middlewareAuth, subscribe);

router.post("/send-test-push-notification", middlewareAuth, sendTestPushNotification);

router.post("/connection", checkConnection);

router.get("/push", middlewareAuth, push);

// Export the router
export default router;
