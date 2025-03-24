import Validator from "fastest-validator";

const schemaMiddleware = (options = {}) => {
	const schema = options.schema || null;

	const validator = new Validator();

	const check = validator.compile(schema);

	return (req, res, next) => {
		let body = req.body || {};

		let result = check(body);

		next();
	};
};

export default schemaMiddleware;
