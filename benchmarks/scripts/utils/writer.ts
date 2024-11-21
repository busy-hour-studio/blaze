import autocannon from 'autocannon';
import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import { BENCHMARK } from '../../config';

export function constructResult(result: autocannon.Result) {
  return {
    framework: result.title || '',
    rps: result.requests.total / result.duration,
    p50: result.requests.p50,
    p75: result.requests.p75,
    p99: result.requests.p99,
  };
}

export function constructMarkdown(results: autocannon.Result[]) {
  const constructedResults = results.map(constructResult);
  const headers = [
    'Framework',
    'RPS (req/sec)',
    'P50 (ms)',
    'P75 (ms)',
    'P99 (ms)',
  ];
  const divider = headers.map(() => '---').join(' | ');
  const headerRow = headers.join(' | ');

  const rows = constructedResults.map((result) =>
    [
      result.framework,
      result.rps.toFixed(2),
      result.p50.toFixed(2),
      result.p75.toFixed(2),
      result.p99.toFixed(2),
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
