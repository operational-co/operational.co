import verifyJwt from "#lib/verify-jwt.js";
import Session from "#services/session/index.js";

async function auth(req, res, next) {
	if (!req.headers["authorization"]) {
		res.status(401).send("Unauthorized");
		return;
	}

	const url = new URL(req.url, `http://${req.headers.host}`);
	const pathname = url.pathname;

	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader) {
		console.log("Unauthorized - Missing Authorization Header");
		// If not present, return a 401 Unauthorized response
		res
			.status(401)
			.send({ error: "Unauthorized - Missing Authorization Header" });
		return;
	}

	// Split the header to get the Bearer token
	const [bearer, token] = authorizationHeader.split(" ");

	if (!token) {
		console.log("Unauthorized - Missing Authorization Header token");
		res
			.status(401)
			.send({ error: "Unauthorized - Missing Authorization Header token" });
		return;
	}

	const decoded = verifyJwt(token);

	if (!decoded) {
		console.log("Unauthorized - invalid signature");
		res.status(401).send({ error: "Unauthorized - invalid signature" });
	}

	const sid = decoded.sid;

	res.locals.sid = sid;

	// check jwt in session
	const session = await Session.validate(sid);

	if (!session) {
		console.log("Unauthorized", sid);
		res.status(401).send("Unauthorized");
		return;
	}

	const user = session.user || {}; //await UserModel.findById(session.userId, true);

	if (user) {
		// also, extend the session here. No need to extend if users is trying to log out
		if (pathname !== "/user/logout") {
			Session.extend(session);
		}
		res.locals.user = user;

		next();
	} else {
		console.log("Unauthorized");
		Session.invalidate(session.sid);
		res.status(401).send("Unauthorized");
	}

	return;
}

export default auth;
