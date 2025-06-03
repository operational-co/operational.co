const DEFAULT_TIMEOUT_MS = 5000;

function withTimeout(promise, sql, context = "", timeoutMs = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        console.error(`[RAW-TIMEOUT] Query timed out after ${timeoutMs}ms`);
        if (context) console.error(`[Context]`, context);
        if (sql) console.error(`[SQL]`, sql);
        reject(new Error(`Query timeout after ${timeoutMs}ms in ${context || "unknown location"}`));
      }, timeoutMs),
    ),
  ]);
}

async function rawQueryWithTimeout({
  sql,
  params = [],
  context = "",
  timeoutMs = DEFAULT_TIMEOUT_MS,
  isSelect = true,
}) {
  const query = isSelect
    ? prisma.$queryRawUnsafe(sql, ...params)
    : prisma.$executeRawUnsafe(sql, ...params);

  return withTimeout(query, sql, context, timeoutMs);
}

export default rawQueryWithTimeout;
