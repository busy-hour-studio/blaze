import autocannon from 'autocannon';
import { BENCHMARK, FRAMEWORK_PORTS } from '../../config';
import { loadFramework } from './loader';

export async function benchmark(framework: string, port: number) {
  console.log(`Benchmarking ${framework} on port ${port}`);

  const result = await autocannon({
    title: framework,
    url: `http://localhost:${port}`,
    connections: BENCHMARK.CONNECTIONS,
    duration: BENCHMARK.DURATION,
    pipelining: BENCHMARK.PIPELINING,
  });

  return result;
}

export async function benchmarks(runtime: 'node' | 'bun') {
  const results = await Promise.all(
    FRAMEWORK_PORTS.map(async ({ framework, port }) => {
      const childProcess = loadFramework(framework.toLowerCase(), runtime);

      const result = await benchmark(framework, port);
      childProcess.kill('SIGINT');

      return result;
    })
  );

  return results;
}
