import { outputPath } from '../config';
import { benchmarks } from './utils/benchmark';
import { writeToMarkdown } from './utils/writer';

benchmarks('bun').then(async (result) => {
  await writeToMarkdown(outputPath, result, 'bun');

  process.exit(0);
});
