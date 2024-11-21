import { outputPath } from '../config';
import { benchmarks } from './utils/benchmark';
import { writeToMarkdown } from './utils/writer';

benchmarks('node').then(async (result) => {
  await writeToMarkdown(outputPath, result, 'node');

  process.exit(0);
});
