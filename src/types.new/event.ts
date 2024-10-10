import type { ZodSchema } from 'zod';
import type { Random, RecordUnknown } from './common';
import type { BlazeEventHandler } from './handler';

export interface BlazeEvent<
  M extends RecordUnknown = RecordUnknown,
  P extends ZodSchema = ZodSchema,
> {
  validator?: P | null;
  handler: BlazeEventHandler<M, P['_output']>;
  throwOnValidationError?: boolean | null;
}

export type AnyBlazeEvent = BlazeEvent<Random, Random>;

export type AnyBlazeEvents = Record<string, AnyBlazeEvent>;

export interface CreateBlazeEventOption {
  event: BlazeEvent;
  serviceName: string;
  eventAlias: string;
}
