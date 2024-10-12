import { BlazeContext, BlazeEvent } from '../../internal/index.ts';
import type { RecordUnknown } from '../../types/common.ts';
import type { BlazeEvent as PlainBlazeEvent } from '../../types/event.ts';
import type { BlazeValidator } from '../../types/validator.ts';
import { RESERVED_KEYWORD } from '../../utils/constants/broker.ts';
import { eventHandler } from '../helpers/index.ts';
import type { BlazeServiceEventOption } from './types.ts';

export class BlazeServiceEvent {
  public readonly serviceName: string;
  public readonly eventName: string;
  public readonly event: PlainBlazeEvent;
  private readonly validator: BlazeValidator;

  constructor(options: BlazeServiceEventOption) {
    this.serviceName = options.serviceName;
    this.eventName = [
      RESERVED_KEYWORD.PREFIX.EVENT,
      this.serviceName,
      options.eventAlias,
    ].join('.');
    this.event = options.event;
    this.validator = {
      body: this.event.validator ?? null,
    };

    BlazeEvent.on(this.eventName, this.eventHandler.bind(this));
  }

  public async eventHandler(body: RecordUnknown) {
    const ctx = await BlazeContext.create({
      honoCtx: null,
      body,
      params: null,
      headers: null,
      query: null,
      validator: this.validator,
      meta: null,
      onError: this.event.onError ?? null,
    });

    const options = {
      handler: this.event.handler,
    };

    return eventHandler(options, ctx);
  }
}
