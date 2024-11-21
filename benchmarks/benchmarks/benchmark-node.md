# Autocannon Benchmarks

**Runtime**: node
**Date**: 2024-11-21T05:58:08.422Z
**CPU**: Ryzen 7 8700G w/ Radeon 780M Graphics
**RAM**: 24036.32 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | RPS (req/sec) | P50 RPS (req/sec) | P75 RPS (req/sec) | P99 RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P99 Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | ------------- | ----------------- | ----------------- | ----------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Blaze     | 46025.66      | 43007.00          | 45023.00          | 96831.00          | 22 ms            | 25 ms            | 31 ms            | 1 ms             | 1181 ms          |
| Hono      | 40502.14      | 42911.00          | 43007.00          | 50143.00          | 23 ms            | 25 ms            | 31 ms            | 4 ms             | 2185 ms          |
| Express   | 31927.06      | 34879.00          | 36127.00          | 39039.00          | 24 ms            | 28 ms            | 56 ms            | 13 ms            | 3205 ms          |
