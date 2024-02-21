import { BlazeEvent } from '@/event/BlazeEvent';
import type { Event } from '@/types/event';
import type { RecordString, RecordUnknown } from '@/types/helper';
import type { CreateEventOption } from '@/types/service';
import { createContext } from '../common';
import { RESERVED_KEYWORD } from '../constant';
import { eventHandler } from '../helper/handler';

export class BlazeServiceEvent {
  public readonly serviceName: string;
  public readonly eventName: string;
  public readonly event: Event;

  constructor(options: CreateEventOption) {
    this.serviceName = options.serviceName;
    this.eventName = [
      RESERVED_KEYWORD.PREFIX.EVENT,
      this.serviceName,
      options.eventAlias,
    ].join('.');
    this.event = options.event;

    BlazeEvent.on(this.eventName, this.eventHandler.bind(this));
  }

  public async eventHandler(
    body: RecordUnknown,
    params: RecordUnknown,
    headers: RecordString
  ) {
    const contextRes = await createContext({
      honoCtx: null,
      body,
      headers,
      params,
      validator: this.event.validation as never,
      throwOnValidationError: this.event.throwOnValidationError,
    });

    if (!contextRes.ok) return contextRes;

    const { result: blazeCtx } = contextRes;

    const options = {
      handler: this.event.handler,
    };

    return eventHandler(options, blazeCtx);
  }
}
