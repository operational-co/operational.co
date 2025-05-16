import express from "express";

import component from "./index.js";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";

import config from "#lib/config.js";

// Create a new router instance
const router = express.Router();

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

const sendTestPushNotification = async (req, res) => {
  const sid = res.locals.sid;
  try {
    const pushSubscriptions = await component.sendTestPushNotification(res.locals.user.id, sid);
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
  console.log(res.locals);
  const sid = res.locals.sid;

  try {
    const push = await component.getPush(sid);
    return res.status(200).send(push);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: err,
    });
  }
};

router.get("/stats", middlewareAuth, getStats);

router.post("/subscribe-push", middlewareAuth, subscribe);

router.post("/send-test-push-notification", middlewareAuth, sendTestPushNotification);

router.post("/connection", checkConnection);

router.get("/push", middlewareAuth, push);

// Export the router
export default router;
