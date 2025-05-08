import express from "express";

import component from "./index.js";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";

// Create a new router instance
const router = express.Router();

const activate = async (req, res) => {
	let form = {
		code: req.body.code,
	};
	if (!req.body.code) {
		return res.status(400).send({ message: `No code passed` });
	}

	try {
		let user = await component.activate(form);
		return res.status(201).send({
			...user,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).send({
			message: err,
		});
	}
};

const create = async (req, res) => {};

const activateSchema = {
	schema: {
		id: {
			type: "number",
		},
		code: {
			type: "string",
		},
	},
};

const createSchema = {
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

router.post("/activate", middlewareSchema(activateSchema), activate);

router.post("/", middlewareAuth, middlewareSchema(createSchema), create);

// Export the router
export default router;
