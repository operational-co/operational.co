import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";

class Session extends Model {}

export default new Session("session", prisma);
