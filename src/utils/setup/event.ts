import { BlazeEvent } from '@/event/BlazeEvent';
import type { Event, EventActionHandler } from '@/types/event';
import type { RecordString, RecordUnknown } from '@/types/helper';
import type { Service } from '@/types/service';
import { createContext, getServiceName } from '../common';
import { RESERVED_KEYWORD } from '../constant';
import { eventHandler } from '../helper/handler';

export class BlazeServiceEvent {
  public readonly serviceName: string;
  public readonly handlers: EventActionHandler[];

  constructor(options: Service) {
    this.serviceName = getServiceName(options);
    this.handlers = [];

    if (!options.events) return;

    this.handlers = Object.entries<Event>(
      options.events
    ).map<EventActionHandler>(([eventAlias, event]) => {
      const eventName = [
        RESERVED_KEYWORD.PREFIX.EVENT,
        this.serviceName,
        eventAlias,
      ].join('.');

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const eventHandler = this.eventHandler(event);

      BlazeEvent.on(eventName, eventHandler);

      return {
        name: eventName,
        handler: eventHandler,
      };
    });
  }

  private eventHandler(event: Event) {
    return async function evtHandler(
      body: RecordUnknown,
      params: RecordUnknown,
      headers: RecordString
    ) {
      const contextRes = await createContext({
        honoCtx: null,
        body,
        headers,
        params,
      });

      if (!contextRes.ok) return contextRes;

      const { result: blazeCtx } = contextRes;

      const options = {
        handler: event.handler,
      };

      return eventHandler(options, blazeCtx);
    };
  }
}
