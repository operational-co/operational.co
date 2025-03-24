import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import SessionModel from "#models/session.js";
import generateJwt from "./generate-jwt.js";

async function generateSession(user) {
  const sid = uuidv4();

  const date = moment().add(7, "days").toISOString();

  await SessionModel.client.create({
    data: {
      sid: sid,
      userId: user.id,
      expiresAt: date,
    },
  });

  const jwt = generateJwt(sid);

  return jwt;
}

export default generateSession;
