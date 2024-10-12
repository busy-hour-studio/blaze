import type { ZodSchema } from 'zod';
import type { BlazeContext } from '../internal/index.ts';
import type { Random, RecordString, RecordUnknown } from './common.ts';
import type { OnBlazeActionEventErrorHandler } from './handler.ts';

export interface BlazeEventHandler<
  M extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
> {
  (
    ctx: BlazeContext<M, RecordString, RecordUnknown, RecordUnknown, P>
  ): Promise<void>;
}

export interface BlazeEvent<
  M extends RecordUnknown = RecordUnknown,
  P extends ZodSchema = ZodSchema,
> {
  validator?: P | null;
  handler: BlazeEventHandler<M, P['_output']>;
  onError?: OnBlazeActionEventErrorHandler<
    M,
    RecordString,
    RecordUnknown,
    RecordUnknown,
    P['_output']
  > | null;
}

export type AnyBlazeEvent = BlazeEvent<RecordUnknown, Random>;

export interface AnyBlazeEvents {
  [key: string]: AnyBlazeEvent;
}
