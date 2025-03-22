import { customAlphabet } from "nanoid";

import Log from "#components/events/model.js";
import { v4 as uuidv4 } from "uuid";
import Db from "#services/db/index.js";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 24);

function generateApikey(prefix = "ops") {
	let apikey = `${prefix}_${nanoid()}`;

	return apikey;
}

export default generateApikey;
