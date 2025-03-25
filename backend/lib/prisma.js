import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Prisma middleware - not being used at the moment
 */
// prisma.$use(async (params, next) => {
//   const result = await next(params);

//   return result;
// });

export default prisma;
