import Validator from "fastest-validator";

const validator = new Validator();

const schemaMiddleware = (options = {}) => {
	const schema = options.schema || null;

	let check = null;

	if (schema) {
		try {
			check = validator.compile(schema);
		} catch (err) {
			console.log(schema);
			throw err;
		}
	}

	return (req, res, next) => {
		let body = req.body || {};

		if (!schema) {
			next();
		} else {
			let result = check(body);

			if (result) {
				next();
			} else {
				console.log(`Err with check()`);
				res.sendStatus(400);
			}
		}
	};
};

export default schemaMiddleware;
