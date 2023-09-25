export class TokenBucket {
  tokens: number;
  fillRatePerSecond: number;
  capacity: number;

  lastFilledMs: number;

  constructor(capacity: number, fillRate: number) {
    this.tokens = capacity;
    this.fillRatePerSecond = fillRate;
    this.capacity = capacity;
    this.lastFilledMs = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastFilledMs) / 1000;
    const tokensToAdd = elapsedSeconds * this.fillRatePerSecond;
    this.tokens = Math.min(this.tokens + tokensToAdd, this.capacity);
    this.lastFilledMs = now;
  }

  consume(count: number) {
    this.refill();

    if (this.tokens < count) {
      return false;
    }
    this.tokens -= count;
    return true;
  }
}
