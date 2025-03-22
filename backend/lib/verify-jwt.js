import jwt from "jsonwebtoken";
import config from "./config.js";

function verifyJwt(token) {
	let result = null;
	try {
		result = jwt.verify(token, config.SECRET);
	} catch (err) {
		//console.log(err);
	}

	return result;
}

export default verifyJwt;
