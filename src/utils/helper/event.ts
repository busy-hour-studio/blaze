import { BlazeContext } from '@/event/BlazeContext';
import { BlazeEvent } from '@/event/BlazeEvent';
import type { Event, EventActionHandler } from '@/types/event';
import type { RecordUnknown } from '@/types/helper';
import type { Service } from '@/types/service';
import { getServiceName, resolvePromise } from '../common';
import { RESERVED_KEYWORD } from '../constant';

export function createEventActionHandler(event: Event) {
  return async function EventActionHandler(body: RecordUnknown): Promise<void> {
    const [blazeCtx, blazeErr] = await resolvePromise(
      BlazeContext.create({
        honoCtx: null,
        body,
        params: null,
        headers: null,
      })
    );

    if (!blazeCtx || blazeErr) return;

    event.handler(blazeCtx as never);
  };
}

export function setupEvent(service: Service): EventActionHandler[] {
  if (!service.events) return [];

  const handlers = Object.entries<Event>(
    service.events
  ).map<EventActionHandler>(([actionAlias, action]) => {
    const serviceName = getServiceName(service);
    const actionName = [
      RESERVED_KEYWORD.PREFIX.EVENT,
      serviceName,
      actionAlias,
    ].join('.');

    const eventHandler = createEventActionHandler(action);

    BlazeEvent.on(actionName, eventHandler);

    return {
      name: actionName,
      handler: eventHandler,
    };
  });

  return handlers;
}
