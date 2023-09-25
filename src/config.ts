import { z } from "zod";
import { Route } from "./RateLimiter";

const configSchema = z.array(
  z.object({
    endpoint: z.string(),
    burst: z.number(),
    sustained: z.number(),
  })
);

export type RouteConfig = {
  endpoint: Route;
  burst: number;
  sustained: number;
};

export type Config = z.infer<typeof configSchema>;

const DEFAULT_CONFIG_PATH = "../config.json";

export const getRateLimiterConfigFromFile = (
  path: string = DEFAULT_CONFIG_PATH
) => {
  const rawConfig: unknown = require(path);
  return configSchema.parse(rawConfig);
};
