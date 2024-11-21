# Autocannon Benchmarks

**Runtime**: node
**Date**: November 21, 2024 02:36:31 PM +07:00
**CPU**: Ryzen 7 8700G w/ Radeon 780M Graphics
**RAM**: 24036.32 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | RPS (req/sec) | P50 RPS (req/sec) | P75 RPS (req/sec) | P99 RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P99 Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | ------------- | ----------------- | ----------------- | ----------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Blaze     | 48616.44      | 46015.00          | 48031.00          | 94975.00          | 21 ms            | 23 ms            | 29 ms            | 1 ms             | 1218 ms          |
| Hono      | 43434.27      | 46015.00          | 47007.00          | 50623.00          | 21 ms            | 23 ms            | 29 ms            | 2 ms             | 2221 ms          |
| Express   | 32503.53      | 35679.00          | 37183.00          | 38879.00          | 23 ms            | 36 ms            | 52 ms            | 13 ms            | 3253 ms          |
