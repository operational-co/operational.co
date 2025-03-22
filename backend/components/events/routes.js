import express from "express";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";
import component from "./index.js";
import config from "#lib/config.js";

// Create a new router instance
const router = express.Router();

const action = async (req, res) => {
	let params = {};

	const testMode = req.headers["x-test"] || false;
	params.testMode = !!testMode;

	try {
		let event = await component.doAction(
			req.body.action,
			req.body.event,
			params,
		);
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
		console.log(err);
		// if (err && err.response) {
		// 	console.log(err.response.data);
		// }
		res.status(400);
		return res.send(err);
	}
};

const get = async (req, res) => {
	let params = {
		...req.query,
	};

	const testMode = req.headers["x-test"] || false;
	params.test = !!testMode;

	if (params["mentions[]"]) {
		params.mentions = params["mentions[]"];
		delete params["mentions[]"];
	}

	params.workspaceId = res.locals.user.primaryWorkspace;
	params.take = config.events.take;

	const events = await component.find(params).catch((err) => {
		throw err;
	});

	return res.send(events);
};

const getLatest = async (req, res) => {
	let params = {
		...req.query,
	};

	const testMode = req.headers["x-test"] || false;
	params.test = !!testMode;

	if (params["mentions[]"]) {
		params.mentions = params["mentions[]"];
		delete params["mentions[]"];
	}

	params.workspaceId = res.locals.user.primaryWorkspace;
	params.take = config.events.take;

	const events = await component.findLatest(params).catch((err) => {
		throw err;
	});

	return res.send(events);
};

const actionSchema = {
	schema: {},
};

const getLatestSchema = {
	schema: {
		query: {
			type: "string",
			default: "",
		},
		cursor: {
			type: "string",
			default: "",
		},
		category: {
			optional: true,
			type: "string",
		},
		test: {
			type: "boolean",
			default: false,
		},
	},
};

const getSchema = {
	schema: {
		skip: {
			type: "number",
			default: 0,
		},
		query: {
			type: "string",
			default: "",
		},
		cursor: {
			type: "string",
			default: "",
		},
		mentions: {
			optional: true,
			type: "array",
		},
		category: {
			optional: true,
			type: "string",
		},
		muted: {
			type: "boolean",
			default: false,
		},
		contextId: {
			optional: true,
			type: "string",
		},
		contextStart: {
			type: "boolean",
			default: false,
		},
		test: {
			type: "boolean",
			default: false,
		},
	},
};

router.get(
	"/latest",
	middlewareAuth,
	middlewareSchema(getLatestSchema),
	getLatest,
);

router.get("/", middlewareAuth, middlewareSchema(getSchema), get);

router.post("/action", middlewareAuth, middlewareSchema(actionSchema), action);

// Export the router
export default router;
