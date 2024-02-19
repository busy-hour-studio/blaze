import { BlazeEvent } from '@/event/BlazeEvent';
import type { Event } from '@/types/action';
import type { EventHandler } from '@/types/event';
import type { Service } from '@/types/service';
import { createContext, getServiceName } from '../common';
import { RESERVED_KEYWORD } from '../constant';
import { eventHandler } from '../helper/handler';

export class BlazeServiceEvent {
  public readonly serviceName: string;
  public readonly handlers: EventHandler[];

  constructor(options: Service) {
    this.serviceName = getServiceName(options);
    this.handlers = [];

    if (!options.events) return;

    this.handlers = Object.entries<Event>(options.events).map<EventHandler>(
      ([eventAlias, event]) => {
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
      }
    );
  }

  private eventHandler(event: Event) {
    return async function evtHandler(
      body: Record<string, unknown>,
      params: Record<string, unknown>,
      headers: Record<string, string>
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
        handler: event,
      };

      return eventHandler(options, blazeCtx);
    };
  }
}
