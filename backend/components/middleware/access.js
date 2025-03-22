import verifyJwt from "#lib/verify-jwt.js";
import Session from "#services/session/index.js";
import accessCheck from "#lib/access-check.js";
import config from "#lib/config.js";

async function auth(req, res, next) {
	// No point, if is selfhosted
	if (config.SELFHOSTED) {
		next();
		return;
	}

	const data = await accessCheck(req.body.email);

	if (data) {
		next();
		return;
	} else {
		res.status(400).send({
			message: "Something went wrong, try again later",
		});
		return;
	}
}

export default auth;
