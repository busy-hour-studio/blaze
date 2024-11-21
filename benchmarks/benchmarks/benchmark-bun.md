# Autocannon Benchmarks

**Runtime**: bun
**Date**: November 21, 2024 02:35:59 PM +07:00
**CPU**: Ryzen 7 8700G w/ Radeon 780M Graphics
**RAM**: 24036.32 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | RPS (req/sec) | P50 RPS (req/sec) | P75 RPS (req/sec) | P99 RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P99 Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | ------------- | ----------------- | ----------------- | ----------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Blaze     | 46914.55      | 46015.00          | 49023.00          | 81855.00          | 22 ms            | 38 ms            | 52 ms            | 1 ms             | 3519 ms          |
| Hono      | 45059.91      | 46015.00          | 49023.00          | 63903.00          | 21 ms            | 23 ms            | 28 ms            | 1 ms             | 2138 ms          |
| Express   | 32521.91      | 35999.00          | 37119.00          | 38655.00          | 23 ms            | 37 ms            | 51 ms            | 11 ms            | 3142 ms          |
