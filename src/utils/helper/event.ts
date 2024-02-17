import { BlazeContext } from '@/event/BlazeContext';
import { BlazeEvent } from '@/event/BlazeEvent';
import { ServiceEventHandler } from '@/types/action';
import { EventHandler } from '@/types/event';
import { Service } from '@/types/service';
import { getServiceName, resolvePromise } from '../common';
import { RESERVED_KEYWORD } from '../constant';

export function createEventHandler(event: ServiceEventHandler) {
  return async function eventHandler(
    body: Record<string, unknown>,
    params: Record<string, unknown>,
    headers: Record<string, string>
  ): Promise<void> {
    const [blazeCtx, blazeErr] = await resolvePromise(
      BlazeContext.create({
        honoCtx: null,
        body,
        params,
        headers,
      })
    );

    if (!blazeCtx || blazeErr) return;

    event(blazeCtx);
  };
}

export function setupEvent(service: Service): EventHandler[] {
  if (!service.events) return [];

  const handlers = Object.entries<ServiceEventHandler>(
    service.events
  ).map<EventHandler>(([actionAlias, action]) => {
    const serviceName = getServiceName(service);
    const actionName = [
      RESERVED_KEYWORD.PREFIX.EVENT,
      serviceName,
      actionAlias,
    ].join('.');

    const eventHandler = createEventHandler(action);

    BlazeEvent.on(actionName, eventHandler);

    return {
      name: actionName,
      handler: eventHandler,
    };
  });

  return handlers;
}
