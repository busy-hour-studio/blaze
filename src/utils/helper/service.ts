import { Service } from '@/types/service';
import { hasOwnProperty } from '../common';

export function loadService(filePath: string) {
  const file = require(filePath) as
    | Service
    | {
        default: Service;
      };

  let service: Service;

  if (
    // use __esModule as indicator for bun
    hasOwnProperty<Service>(file, '__esModule') ||
    // use default as indicator for node
    hasOwnProperty<Service>(file, 'default')
  ) {
    service = file.default;
  } else {
    service = file;
  }

  return service;
}
