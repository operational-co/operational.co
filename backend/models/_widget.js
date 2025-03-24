import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";

class Widget extends Model {}

export default new Widget("widget", prisma);
