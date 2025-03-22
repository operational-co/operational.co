import component from "./index.js";

import middlewareAuth from "#components/middleware/auth.js";

export default async function (fastify, options, next) {
  fastify.addHook("onRequest", middlewareAuth);

  fastify.get(`/`, {}, async (req, reply) => {
    let params = {
      ...req.query,
    };

    params.workspaceId = reply.locals.user.workspaceId;

    const widgets = await component.find(params).catch((err) => {
      throw err;
    });

    return reply.send(widgets);
  });

  next();
}
