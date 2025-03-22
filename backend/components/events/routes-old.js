import component from "./index.js";

import middlewareAuth from "#components/middleware/auth.js";

import axios from "axios";

import config from "#lib/config.js";

const getProperties = {
	schema: {
		querystring: {
			type: "object",
			properties: {
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
					type: "array",
					items: {
						type: "string",
					},
				},
				muted: {
					type: "boolean",
					default: false,
				},
				contextId: {},
				contextStart: {
					type: "boolean",
					default: false,
				},
				expireIn: {},
			},
		},
	},
};

export default async function (fastify, options, next) {
	fastify.addHook("onRequest", middlewareAuth);

	// basic search
	fastify.get(`/`, getProperties, async (req, reply) => {
		let params = {
			...req.query,
		};

		const testMode = req.headers["x-test"] || false;
		params.test = !!testMode;

		if (params["mentions[]"]) {
			params.mentions = params["mentions[]"];
			delete params["mentions[]"];
		}

		params.workspaceId = reply.locals.user.primaryWorkspace;
		params.take = config.events.take;

		const events = await component.find(params).catch((err) => {
			throw err;
		});

		return reply.send(events);
	});

	fastify.post(
		"/action",
		{
			schema: {},
		},
		async (req, reply) => {
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
					reply.code(400);
					return reply.send(event);
				}

				if (event) {
					reply.code(201);
					return reply.send(event);
				} else {
					reply.code(200);
					return reply.send(null);
				}
			} catch (err) {
				// if (err && err.response) {
				// 	console.log(err.response.data);
				// }
				reply.code(400);
				return reply.send(err);
			}
		},
	);

	next();
}
