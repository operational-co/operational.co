import express from "express";

import component from "./index.js";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";

// Create a new router instance
const router = express.Router();

const get = async (req, res) => {
  const user = res.locals.user;

  const invoices = await component.findByWorkspaceId(user.primaryWorkspace);

  return res.status(200).send(invoices);
};

const download = async (req, res) => {
  let invoiceId = parseInt(req.params.id);
  if (isNaN(invoiceId)) {
    return res.status(400).send(null);
  }
  await component.download(invoiceId, res);
};

router.get("/", middlewareAuth, get);

router.post(`/:id/download`, middlewareAuth, download);

// router.post("/activate", middlewareSchema(activateSchema), activate);

// router.post("/", middlewareAuth, middlewareSchema(createSchema), create);

// Export the router
export default router;
