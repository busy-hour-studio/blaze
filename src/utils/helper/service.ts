import { Service } from '../../types/service.ts';
import { hasOwnProperty, loadFile } from '../common.ts';

export async function loadService(filePath: string) {
  const file:
    | Service
    | {
        default: Service;
      } = await loadFile(filePath);

  let service: Service;

  if (
    // use __esModule as indicator for bun
    hasOwnProperty<Service>(file, '__esModule') ||
    // use default as indicator for node
    hasOwnProperty<Service>(file, 'default')
  ) {
    service = file.default;

    // In case it exports default twice
    if (hasOwnProperty<Service>(service, 'default')) {
      service = service.default;
    }
  } else {
    service = file;
  }

  return service;
}
