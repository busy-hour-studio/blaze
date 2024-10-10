import type { ZodSchema } from 'zod';
import type { Random, RecordString, RecordUnknown } from './common';
import type { BlazeEventHandler, BlazeValidationErrorHandler } from './handler';

export interface BlazeEvent<
  M extends RecordUnknown = RecordUnknown,
  P extends ZodSchema = ZodSchema,
> {
  validator?: P | null;
  handler: BlazeEventHandler<M, P['_output']>;
  onValidationError?: BlazeValidationErrorHandler<
    M,
    RecordString,
    P['_output'],
    RecordUnknown,
    RecordUnknown
  >;
}

export type AnyBlazeEvent = BlazeEvent<Random, Random>;

export type AnyBlazeEvents = Record<string, AnyBlazeEvent>;

export interface CreateBlazeEventOption {
  event: BlazeEvent;
  serviceName: string;
  eventAlias: string;
}
