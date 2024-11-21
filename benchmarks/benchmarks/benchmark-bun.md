# Autocannon Benchmarks

**Runtime**: bun
**Date**: 2024-11-21T05:57:36.846Z
**CPU**: Ryzen 7 8700G w/ Radeon 780M Graphics
**RAM**: 24036.32 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | RPS (req/sec) | P50 RPS (req/sec) | P75 RPS (req/sec) | P99 RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P99 Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | ------------- | ----------------- | ----------------- | ----------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Blaze     | 47192.45      | 44031.00          | 46015.00          | 96895.00          | 21 ms            | 24 ms            | 31 ms            | 1 ms             | 1227 ms          |
| Hono      | 41908.34      | 44031.00          | 45023.00          | 53439.00          | 22 ms            | 24 ms            | 31 ms            | 6 ms             | 2257 ms          |
| Express   | 30997.50      | 34207.00          | 35487.00          | 36959.00          | 24 ms            | 39 ms            | 55 ms            | 3 ms             | 3278 ms          |
