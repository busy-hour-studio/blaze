import { type LoadServiceOption } from '@/types/service';
import fs from 'node:fs';
import { initializeService } from './helper/setup';

export function initializeServices(options: LoadServiceOption) {
  const { app, path: servicePath } = options;

  if (!fs.existsSync(servicePath)) {
    throw new Error("Service path doesn't exist");
  }

  const services = fs.readdirSync(servicePath);
  const pendingServices = services.map(initializeService(app, servicePath));

  pendingServices.forEach((onStarted) => onStarted());
}
