import { BlazeError } from '@/errors/BlazeError';
import type { BlazeContext } from '@/event/BlazeContext';
import { BlazeEvent } from '@/event/BlazeEvent';
import { Hono } from 'hono';
import path from 'node:path';
import { getRestPath, getServiceName } from '../common';
import { RESERVED_KEYWORD } from '../constant';
import { loadService } from '../helper/service';
import { BlazeServiceAction } from './action';
import { BlazeServiceEvent } from './event';

export function initializeService(
  app: Hono,
  servicePath: string,
  blazeCtx: BlazeContext
) {
  // eslint-disable-next-line func-names
  return function (filePath: string) {
    const service = loadService(path.resolve(servicePath, filePath));

    if (!service || !service.name) {
      throw new BlazeError('Service name is required');
    }

    const routePath = getRestPath(service);
    const serviceName = getServiceName(service);
    const killEventName = [serviceName, RESERVED_KEYWORD.SUFFIX.KILL].join('.');

    const actions = new BlazeServiceAction(service);
    const events = new BlazeServiceEvent(service);

    service.onCreated?.(blazeCtx);

    if (actions.router) {
      app.route(`/${routePath}`, actions.router);
    }

    function onStarted() {
      BlazeEvent.on(killEventName, () => {
        BlazeEvent.removeAllListeners(serviceName);
        service.onStopped?.([...actions.handlers, ...events.handlers]);
      });

      service.onStarted?.(blazeCtx);
    }

    return onStarted;
  };
}
