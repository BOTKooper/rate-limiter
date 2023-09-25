import { LimiterResult, RateLimiter } from "./RateLimiter";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const getRouter = (rateLimiter: RateLimiter) => {
  const app = new Hono();

  app.post(
    "/take/",
    zValidator(
      "json",
      z.object({
        uri: z.string(),
        type: z.enum(["burst", "sustained"]),
      })
    ),
    (ctx) => {
      const { uri, type } = ctx.req.valid("json");

      let limiterResult: LimiterResult;

      try {
        limiterResult = rateLimiter.consume(uri, type);
      } catch (e) {
        ctx.status(404);
        return ctx.json({
          message: "Unknown route",
          ok: false,
        });
      }

      ctx.header(
        "X-RateLimit-Limit",
        Math.floor(limiterResult.maxTokens).toString()
      );
      ctx.header(
        "X-RateLimit-Remaining",
        Math.floor(limiterResult.availableTokens).toString()
      );

      // all our quotas are per second, so just set this to 1
      ctx.header("X-RateLimit-Reset", "1");

      if (!limiterResult.isAllowed) {
        ctx.status(429);
        return ctx.json({
          message: "Not allowed",
          ok: false,
        });
      }

      return ctx.json({
        message: "Allowed",
        ok: true,
      });
    }
  );

  return app;
};
