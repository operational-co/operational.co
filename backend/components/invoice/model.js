import prisma from "#lib/prisma.js";
import Model from "#lib/class-model.js";

class Invoice extends Model {}

export default new Invoice("invoice", prisma);
