import jwt from "jsonwebtoken";
import config from "./config.js";

function generateJwt(sid) {
  const token = jwt.sign({ sid: sid }, config.SECRET);

  return token;
}

export default generateJwt;
