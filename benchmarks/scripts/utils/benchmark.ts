import autocannon from 'autocannon';
import { ChildProcess } from 'node:child_process';
import { BENCHMARK, FRAMEWORKS, PORTS } from '../../config';
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
  const childProcesses: ChildProcess[] = [];

  const results = await Promise.all(
    FRAMEWORKS.map(async (framework, index) => {
      const childProcess = loadFramework(framework.toLowerCase(), runtime);

      childProcesses.push(childProcess);

      const result = await benchmark(framework, PORTS[index]);

      return result;
    })
  );

  childProcesses.forEach((childProcess) => {
    childProcess.kill('SIGTERM');
  });

  return results;
}
