import { BlazeEvent } from '@/event/BlazeEvent';
import { Service } from '@/types/service';
import { Hono } from 'hono';
import path from 'node:path';
import { setupAction } from '../actions';
import { getRestPath, getServiceName, hasOwnProperty } from '../common';

function loadService(filePath: string) {
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

export function initializeService(app: Hono, servicePath: string) {
  // eslint-disable-next-line func-names
  return function (filePath: string) {
    const service = loadService(path.resolve(servicePath, filePath));

    if (!service || !service.name) {
      throw new Error('Service name is required');
    }

    const routePath = getRestPath(service);
    const serviceName = getServiceName(service);
    const killEventName = [serviceName, 'kill'].join('.');

    const { router, handlers, blazeCtx } = setupAction(service);

    service.onCreated?.(blazeCtx);

    app.route(`/${routePath}`, router);

    function onStarted() {
      BlazeEvent.on(killEventName, () => {
        BlazeEvent.removeAllListeners(serviceName);
        service.onStopped?.(handlers);
      });

      service.onStarted?.(blazeCtx);
    }

    return onStarted;
  };
}
