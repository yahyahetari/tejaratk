import { toErrorResponse } from "@/lib/utils/errors";
import { logger } from "@/lib/utils/logger";

export function withApi(handler) {
  return async (req, ctx) => {
    const startedAt = Date.now();
    try {
      const res = await handler(req, ctx);
      logger.info(`${req.method} ${new URL(req.url).pathname} ${Date.now() - startedAt}ms`);
      return res;
    } catch (err) {
      logger.error(`API ERROR ${req.method} ${new URL(req.url).pathname}`, {
        message: err?.message,
        code: err?.code,
        status: err?.status,
      });
      return toErrorResponse(err);
    }
  };
}
