# Autocannon Benchmarks

**Runtime**: node
**Date**: November 22, 2024 10:19:52 AM +07:00
**CPU**: Ryzen 7 8700G w/ Radeon 780M Graphics
**RAM**: 24036.32 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Blaze     | 1398603.00     | 46006.68      | 20 ms            | 23 ms            | 28 ms            | 43 ms            | 21.22 ms         | 1 ms             | 1733 ms          |
| Hono      | 1297951.00     | 42709.81      | 21 ms            | 24 ms            | 29 ms            | 47 ms            | 22.88 ms         | 1 ms             | 2231 ms          |
| Express   | 325123.00      | 10698.35      | 84 ms            | 102 ms           | 119 ms           | 175 ms           | 92.68 ms         | 1 ms             | 3288 ms          |
