import { Context } from "hono";

export const customLogger =
  () => async (c: Context, next: () => Promise<void>) => {
    const start = process.hrtime.bigint();
    await next();
    const end = process.hrtime.bigint();
    const durationNs = end - start;
    const durationMs = Number(durationNs) / 1_000_000;
    const durationMicros = Number(durationNs) / 1_000;
    console.log(
      `${c.req.method} ${c.req.url} - ${durationMs.toFixed(2)}ms (${durationMicros.toFixed(2)}μs)`,
    );
  };
