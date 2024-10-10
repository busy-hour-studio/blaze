import { BlazeService } from '../../types/service';
import { hasOwnProperty, loadFile } from '../common';

export async function loadService(filePath: string) {
  const file:
    | BlazeService
    | {
        default: BlazeService;
      } = await loadFile(filePath);

  let service: BlazeService;

  if (
    // use __esModule as indicator for bun
    hasOwnProperty<BlazeService>(file, '__esModule') ||
    // use default as indicator for node
    hasOwnProperty<BlazeService>(file, 'default')
  ) {
    service = file.default;

    // In case it exports default twice
    if (hasOwnProperty<BlazeService>(service, 'default')) {
      service = service.default;
    }
  } else {
    service = file;
  }

  return service;
}
