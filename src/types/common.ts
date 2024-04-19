/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from 'zod';
import { Action, Actions, ActionValidator } from './action';
import { Random, RecordUnknown } from './helper';
import { Service } from './service';

type AnyAction = Action<RecordUnknown, Random, Random, Random>;

export type ExtractValidator<
  DefinedService extends Service,
  ActionName extends keyof DefinedService['actions'],
  ValidationName extends keyof ActionValidator,
  DefaultType = ValidationName extends 'body' ? unknown : RecordUnknown,
> =
  NonNullable<DefinedService['actions']> extends Actions
    ? NonNullable<DefinedService['actions'][ActionName]> extends AnyAction
      ? NonNullable<
          // @ts-ignore
          DefinedService['actions'][ActionName]['validator']
        > extends ActionValidator<Random, Random, Random>
        ? NonNullable<
            // @ts-ignore
            DefinedService['actions'][ActionName]['validator'][ValidationName]
          > extends z.ZodObject<z.ZodRawShape>
          ? z.infer<
              // @ts-ignore
              DefinedService['actions'][ActionName]['validator'][ValidationName]
            >
          : DefaultType
        : DefaultType
      : DefaultType
    : DefaultType;

export type ExtractHandler<
  DefinedService extends Service,
  ActionName extends keyof DefinedService['actions'],
> =
  NonNullable<DefinedService['actions']> extends Actions
    ? NonNullable<DefinedService['actions'][ActionName]> extends AnyAction
      ? // @ts-ignore
        Awaited<ReturnType<DefinedService['actions'][ActionName]['handler']>>
      : unknown
    : unknown;

export type ActionEventCallRequest<
  Headers extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Result = unknown,
> = {
  headers: Headers;
  params: Params;
  body: Body;
  result: Result;
};

export interface ActionCallRecord {
  // Extend the interface with other modules
  // [key: string]: ActionEventCallRequest<
  //   RecordUnknown,
  //   RecordUnknown,
  //   Random,
  //   never
  // >;
}

export interface EventCallRecord {
  // Extend the interface with other modules
  // [key: string]: ActionEventCallRequest<
  //   RecordUnknown,
  //   RecordUnknown,
  //   Random,
  //   never
  // >;
}
