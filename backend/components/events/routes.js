import express from "express";
import middlewareSchema from "#components/middleware/schema.js";
import middlewareAuth from "#components/middleware/auth.js";
import component from "./index.js";
import config from "#lib/config.js";

// Create a new router instance
const router = express.Router();

const headerIsTrue = function (value) {
	return value === true || value === "true" || value === 1 || value === "1";
};

const action = async (req, res) => {
	let params = {};

	params.testMode = headerIsTrue(req.headers["x-test"]);
	params.workspaceId = res.locals.user.primaryWorkspace;

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

	if (req.headers["x-test"] != null) {
		params.test = headerIsTrue(req.headers["x-test"]);
	}

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

	if (req.headers["x-test"] != null) {
		params.test = headerIsTrue(req.headers["x-test"]);
	}

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

const getOne = async (req, res) => {
	let params = {
		...req.query,
		id: req.params.id,
	};

	if (req.headers["x-test"] != null) {
		params.test = headerIsTrue(req.headers["x-test"]);
	}

	if (params["mentions[]"]) {
		params.mentions = params["mentions[]"];
		delete params["mentions[]"];
	}

	params.workspaceId = res.locals.user.primaryWorkspace;
	params.take = config.events.take;

	const event = await component.findOne(params).catch((err) => {
		throw err;
	});

	return res.send(event);
};

const getSurrounding = async (req, res) => {
	let params = {
		...req.query,
		id: req.params.id,
	};

	if (req.headers["x-test"] != null) {
		params.test = headerIsTrue(req.headers["x-test"]);
	}

	params.workspaceId = res.locals.user.primaryWorkspace;

	const events = await component.findSurrounding(params).catch((err) => {
		throw err;
	});

	if (!events) {
		return res.status(404).send({
			message: "Event not found",
		});
	}

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

const getOneSchema = {
	schema: {
		id: {
			type: "string",
			optional: false,
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

router.get("/:id/surrounding", middlewareAuth, getSurrounding);

router.get("/:id", middlewareAuth, middlewareSchema(getOneSchema), getOne);

// Export the router
export default router;
