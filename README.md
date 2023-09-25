# rate-limiter

Simple rate-limiter implemented using Token Bucket algorithm

This was built using [bun](https://bun.sh), so we'll need that runtime

```bash
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.3"
```

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Configuration

Config file type looks like this:

```typescript
type ConfigFileEntry = {
  endpoint: string;
  burst: number;
  sustained: number;
}

type ConfigFile = Array<ConfigFileEntry>
```

You can find example in included [config.json](config.json)

## Environment variables

||||
|-|-|-|
|**Variable**|**Default**|**Description**|
|RATE_LIMIT_CONFIG_PATH|./config.json|where to look for config
|PORT|3000|port to start app on
