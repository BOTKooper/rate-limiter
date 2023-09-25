import { z } from "zod";
import { Route } from "./RateLimiter";

const configSchema = z.array(
  z.object({
    endpoint: z.string(),
    burst: z.number(),
    sustained: z.number(),
  })
);

export type Config = z.infer<typeof configSchema>;

export type RouteConfig = Config extends Array<infer T> ? T : never;

const DEFAULT_CONFIG_PATH = "./config.json";

export const getRateLimiterConfigFromFile = async (
  path: string = DEFAULT_CONFIG_PATH
) => {
  const file = Bun.file(path);

  if (!file.exists()) {
    throw new Error(`Config file ${path} does not exist`);
  }

  const rawConfig = await file.json();
  return configSchema.parse(rawConfig);
};
