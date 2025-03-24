export default async function (fastify, options, next) {
	fastify.post(`/`, {}, async (req, reply) => {
		let logs = [];

		return reply.send(logs);
	});

	next();
}
