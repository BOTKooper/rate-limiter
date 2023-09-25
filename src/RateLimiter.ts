import { TokenBucket } from "./TokenBucket";
import { Config } from "./config";

export type Route = string;

export type LimiterResult = {
  isAllowed: boolean;
  availableTokens: number;
  maxTokens: number;
};

class RateLimiterBucketCombo {
  constructor(public burst: TokenBucket, public sustained: TokenBucket) {}
}

export class RateLimiter {
  buckets: Map<Route, RateLimiterBucketCombo>;

  constructor(config: Config) {
    this.buckets = new Map();

    for (const { endpoint, burst, sustained } of config) {
      this.buckets.set(
        endpoint,
        new RateLimiterBucketCombo(
          new TokenBucket(burst, 1),
          new TokenBucket(sustained, 1)
        )
      );
    }
  }

  consume(route: Route, type: "burst" | "sustained"): LimiterResult {
    const bucket = this.getBucket(route, type);

    const isAllowed = bucket.consume(1);

    return {
      isAllowed,
      availableTokens: bucket.tokens,
      maxTokens: bucket.capacity,
    };
  }

  private getBucket(route: Route, type: "burst" | "sustained"): TokenBucket {
    const routeBuckets = this.buckets.get(route);

    if (!routeBuckets) {
      throw new Error(`Unknown route ${route}`);
    }

    if (!(type in routeBuckets))
      throw new Error(`Unknown type ${type} for route ${route}`);

    return routeBuckets[type];
  }
}
