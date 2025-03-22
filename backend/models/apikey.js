import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";

class Apikey extends Model {}

export default new Apikey("apikey", prisma);
