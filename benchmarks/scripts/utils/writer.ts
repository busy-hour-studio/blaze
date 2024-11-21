import autocannon from 'autocannon';
import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import system from 'systeminformation';
import { BENCHMARK } from '../../config';

export function constructResult(result: autocannon.Result) {
  return {
    framework: result.title || '',
    rps: result.requests.total / result.duration,
    request: {
      p50: result.requests.p50,
      p75: result.requests.p75,
      p99: result.requests.p99,
    },
    latency: {
      p50: result.latency.p50,
      p75: result.latency.p75,
      p99: result.latency.p99,
      min: result.latency.min,
      max: result.latency.max,
    },
  };
}

export function constructMarkdown(results: autocannon.Result[]) {
  const constructedResults = results.map(constructResult);
  const headers = [
    'Framework',
    'RPS (req/sec)',
    'P50 RPS (req/sec)',
    'P75 RPS (req/sec)',
    'P99 RPS (req/sec)',
    'P50 Latency (ms)',
    'P75 Latency (ms)',
    'P99 Latency (ms)',
    'Min Latency (ms)',
    'Max Latency (ms)',
  ];
  const divider = headers.map(() => '---').join(' | ');
  const headerRow = headers.join(' | ');

  const rows = constructedResults.map((result) =>
    [
      result.framework,
      result.rps.toFixed(2),
      result.request.p50.toFixed(2),
      result.request.p75.toFixed(2),
      result.request.p99.toFixed(2),
      `${result.latency.p50} ms`,
      `${result.latency.p75} ms`,
      `${result.latency.p99} ms`,
      `${result.latency.min} ms`,
      `${result.latency.max} ms`,
    ].join(' | ')
  );

  return [headerRow, divider, ...rows].join('\n');
}

// eslint-disable-next-line @typescript-eslint/no-shadow
async function isExists(path: string) {
  try {
    await fs.access(path);

    return true;
  } catch {
    return false;
  }
}

export function prettifyMarkdown(markdown: string) {
  return prettier.format(markdown, { parser: 'markdown' });
}

export async function writeToMarkdown(
  distPath: string,
  results: autocannon.Result[],
  runtime: 'node' | 'bun'
) {
  const markdown = constructMarkdown(results);
  const content = [
    '# Autocannon Benchmarks',
    '',
    `**Runtime**: ${runtime}`,
    `**Date**: ${new Date().toISOString()}`,
    `**CPU**: ${(await system.cpu()).brand}`,
    `**RAM**: ${((await system.mem()).total / 1024 / 1024).toFixed(2)} MB`,
    `**Connections**: ${BENCHMARK.CONNECTIONS}`,
    `**Duration**: ${BENCHMARK.DURATION} seconds`,
    `**Pipelining**: ${BENCHMARK.PIPELINING}`,
    '',
    '## Results',
    '',
    markdown,
  ].join('\n');
  const prettifiedMarkdown = await prettifyMarkdown(content);
  const fileName = `benchmark-${runtime}.md`;
  const finalPath = path.join(distPath, fileName);

  if (await isExists(finalPath)) {
    await fs.unlink(finalPath);
  }

  await fs.mkdir(distPath, { recursive: true });

  return fs.writeFile(finalPath, prettifiedMarkdown);
}
