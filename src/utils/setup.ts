import { Hono } from 'hono';
import fs from 'node:fs';
import path from 'node:path';
import { BlazeEvent } from '@/event/BlazeEvent';
import { createRestPath, createServiceName, loadService } from './common';
import { setupAction } from './actions';

export function loadServices(options: {
  app: Hono;
  servicePath: string;
  ignoreNotFound?: boolean;
}) {
  const { app, servicePath, ignoreNotFound = false } = options;

  if (!fs.existsSync(servicePath)) {
    if (ignoreNotFound) {
      console.log(`Service path doesn't exist: ${servicePath}`);
      console.log('Service setup skipped');

      return;
    }

    throw new Error("Service path doesn't exist");
  }

  const serviceFiles = fs.readdirSync(servicePath);

  const pendingServices = serviceFiles.map((filePath) => {
    const service = loadService(path.resolve(servicePath, filePath));

    if (!service || !service.name) {
      throw new Error('Service name is required');
    }

    const routePath = createRestPath(service);
    const serviceName = createServiceName(service);

    const { router, handlers } = setupAction(service);

    service.onCreated?.(BlazeEvent);

    app.route(`/${routePath}`, router);

    function onStarted() {
      BlazeEvent.on(`${serviceName}.kill`, () => {
        BlazeEvent.removeAllListeners(serviceName);
        service.onStopped?.(handlers);
      });

      service.onStarted?.(BlazeEvent);
    }

    return onStarted;
  });

  pendingServices.forEach((onStarted) => onStarted());
}
