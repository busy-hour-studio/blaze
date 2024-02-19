import type { EventHandler, Event as EventOption } from '@/types/event';
import type { FinalEventType } from '@/types/helper';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

export class BlazeServiceEvent<
  Params extends ZodTypeAny | ZodObject<ZodRawShape> = ZodTypeAny,
  EventType extends FinalEventType<Params> = FinalEventType<Params>,
> {
  private $validation?: Params | null;
  private $handler: EventHandler<EventType['Meta'], EventType['Params']>;

  constructor(options: EventOption<Params, EventType>) {
    this.$validation = options.validation;
    this.$handler = options.handler;
  }

  public get handler() {
    return this.$handler;
  }

  public set handler(value) {
    throw new Error('Cannot set handler for BlazeServiceEvent at runtime!');
  }

  public get validation() {
    return this.$validation;
  }

  public set validation(value) {
    throw new Error('Cannot set validation for BlazeServiceEvent at runtime!');
  }
}
