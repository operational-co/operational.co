import prisma from "./prisma.js";

const DEFAULT_TIMEOUT_MS = 5000; // Set as needed

function withTimeout(promise, sql, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        console.error(`[RAW-TIMEOUT] Query timed out after ${timeoutMs}ms:\n${sql}`);
        reject(new Error(`Query timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }),
  ]);
}

function wrapPrismaRaw(timeoutMs = DEFAULT_TIMEOUT_MS) {
  return {
    async query(sql, ...args) {
      const queryStr = typeof sql === "string" ? sql : sql.sql || "[raw sql tag]";
      console.log(`[RAW-QUERY] Executing: ${queryStr}`);
      const start = Date.now();
      try {
        const result = await withTimeout(prisma.$queryRawUnsafe(sql, ...args), queryStr, timeoutMs);
        console.log(`[RAW-QUERY] Done in ${Date.now() - start}ms`);
        return result;
      } catch (err) {
        console.error(`[RAW-QUERY] Error: ${err.message}`);
        throw err;
      }
    },

    async execute(sql, ...args) {
      const queryStr = typeof sql === "string" ? sql : sql.sql || "[raw sql tag]";
      console.log(`[RAW-EXEC] Executing: ${queryStr}`);
      const start = Date.now();
      try {
        const result = await withTimeout(prisma.$executeRaw(sql, ...args), queryStr, timeoutMs);
        console.log(`[RAW-EXEC] Done in ${Date.now() - start}ms`);
        return result;
      } catch (err) {
        console.error(`[RAW-EXEC] Error: ${err.message}`);
        throw err;
      }
    },
  };
}

export default wrapPrismaRaw();
