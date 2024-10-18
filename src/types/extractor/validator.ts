import type { z } from 'zod';
import type { Actions, AnyAction, AnyValidator } from '../action.ts';
import type { RecordString, RecordUnknown } from '../common.ts';
import { AnyEvent, Events } from '../event.ts';
import type { Service } from '../service.ts';

export type ExtractActionValidator<
  S extends Service,
  A extends keyof S['actions'],
  V extends keyof AnyValidator,
  D = V extends 'body'
    ? unknown
    : V extends 'headers'
      ? RecordString
      : RecordUnknown,
> =
  NonNullable<S['actions']> extends Actions
    ? NonNullable<S['actions']>[A] extends AnyAction
      ? NonNullable<
          NonNullable<NonNullable<S['actions']>[A]>['validator']
        > extends AnyValidator
        ? NonNullable<
            NonNullable<
              NonNullable<NonNullable<S['actions']>[A]>['validator']
            >[V]
          > extends z.ZodSchema
          ? z.input<
              NonNullable<
                NonNullable<
                  NonNullable<NonNullable<S['actions']>[A]>['validator']
                >[V]
              >
            >
          : D
        : D
      : D
    : D;

export type ExtractEventValidator<
  S extends Service,
  E extends keyof S['events'],
> =
  NonNullable<S['events']> extends Events
    ? NonNullable<S['events']>[E] extends AnyEvent
      ? NonNullable<
          NonNullable<NonNullable<S['events']>[E]>['validator']
        > extends z.ZodSchema
        ? z.input<
            NonNullable<NonNullable<NonNullable<S['events']>[E]>['validator']>
          >
        : unknown
      : unknown
    : unknown;
