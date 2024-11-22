# Autocannon Benchmarks

**Runtime**: bun
**Date**: November 22, 2024 10:19:20 AM +07:00
**CPU**: Ryzen 7 8700G w/ Radeon 780M Graphics
**RAM**: 24036.32 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Blaze     | 1544193.00     | 49796.61      | 164 ms           | 241 ms           | 288 ms           | 374 ms           | 185.36 ms        | 48 ms            | 733 ms           |
| Hono      | 1564760.00     | 50574.01      | 163 ms           | 234 ms           | 285 ms           | 368 ms           | 183.69 ms        | 53 ms            | 654 ms           |
| Express   | 1069770.00     | 34665.26      | 247 ms           | 290 ms           | 345 ms           | 522 ms           | 236.04 ms        | 49 ms            | 962 ms           |
