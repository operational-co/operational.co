import component from "./index.js";

import middlewareAuth from "#components/middleware/auth.js";

export default async function (fastify, options, next) {
	fastify.addHook("onRequest", middlewareAuth);

	fastify.get(
		`/`,
		{
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
						limited: {
							type: "boolean",
							default: false,
						},
					},
				},
			},
		},
		async (req, reply) => {
			let params = {
				...req.query,
			};

			console.log(params);

			params.workspaceId = reply.locals.user.workspaceId;

			const users = await component.find(params).catch((err) => {
				throw err;
			});

			return reply.send(users);
		},
	);

	next();
}
