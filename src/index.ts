import { RateLimiter } from "./RateLimiter";
import { getRateLimiterConfigFromFile } from "./config";
import { getRouter } from "./router";

console.log("Loading config from file");
const config = getRateLimiterConfigFromFile(process.env.RATE_LIMIT_CONFIG_PATH);

console.log("Done");

console.log("Initializing rate limiter");
const limiter = new RateLimiter(config);
console.log("Done");

console.log("Initializing app router");
const app = getRouter(limiter);
console.log("Done");

console.log("Starting server");

const setup = {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
} as any; // don't want/need to deal with the types here;

export default setup;
