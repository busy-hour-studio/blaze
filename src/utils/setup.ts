import { BlazeContext } from '@/event/BlazeContext';
import type { LoadServiceOption } from '@/types/service';
import fs from 'node:fs';
import { initializeService } from './setup/service';

export function initializeServices(options: LoadServiceOption) {
  const { app, path: servicePath } = options;

  if (!fs.existsSync(servicePath)) {
    throw new Error("Service path doesn't exist");
  }

  const blazeCtx = new BlazeContext({
    body: null,
    params: null,
    headers: null,
    honoCtx: null,
  });

  const services = fs.readdirSync(servicePath);
  const pendingServices = services.map(
    initializeService(app, servicePath, blazeCtx)
  );

  pendingServices.forEach((onStarted) => onStarted());
}
