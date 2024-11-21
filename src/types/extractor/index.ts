/* eslint-disable @typescript-eslint/ban-ts-comment */

import { AnyAction } from '../action';
import { RecordString, RecordUnknown } from '../common';
import { ActionEventCallRequest } from '../external';
import { Service } from '../service';
import { ExtractActionHandler, ProcedureExtractor } from './handler';
import { ExtractActionValidator, ExtractEventValidator } from './validator';

export type ServiceNameExtractor<T extends Service> =
  NonNullable<T['version']> extends number
    ? NonNullable<T['name']> extends string
      ? `v${T['version']}.${T['name']}`
      : `v${T['version']}`
    : NonNullable<T['name']> extends string
      ? `${T['name']}`
      : never;

export type ActionsExtractor<T extends Service> = {
  [A in keyof T['actions'] as `${ServiceNameExtractor<T>}.${A extends string ? A : never}`]: ActionEventCallRequest<
    ExtractActionValidator<T, A, 'header'>,
    ExtractActionValidator<T, A, 'params'>,
    ExtractActionValidator<T, A, 'query'>,
    ExtractActionValidator<T, A, 'body'>,
    ExtractActionHandler<T, A>
  >;
};

export type EventsExtractor<T extends Service> = {
  [E in keyof T['events'] as `${ServiceNameExtractor<T>}.${E extends string ? E : never}`]: ActionEventCallRequest<
    RecordString,
    RecordUnknown,
    RecordUnknown,
    ExtractEventValidator<T, E>,
    unknown
  >;
};

export type TrpcMutationExtractor<T extends Service> = {
  [A in keyof T['actions'] as T['actions'][A] extends AnyAction
    ? // @expect-error properties-not-defined
      NonNullable<T['actions'][A]['trpc']> extends 'mutation'
      ? `${ServiceNameExtractor<T>}.${A extends string ? A : never}`
      : never
    : never]: ProcedureExtractor<
    'mutation',
    ActionEventCallRequest<
      ExtractActionValidator<T, A, 'header'>,
      ExtractActionValidator<T, A, 'params'>,
      ExtractActionValidator<T, A, 'query'>,
      ExtractActionValidator<T, A, 'body'>,
      ExtractActionHandler<T, A>
    >
  >;
};

export type TrpcQueryExtractor<T extends Service> = {
  [A in keyof T['actions'] as T['actions'][A] extends AnyAction
    ? // @expect-error properties-not-defined
      NonNullable<T['actions'][A]['trpc']> extends 'query'
      ? `${ServiceNameExtractor<T>}.${A extends string ? A : never}`
      : never
    : never]: ProcedureExtractor<
    'query',
    ActionEventCallRequest<
      ExtractActionValidator<T, A, 'header'>,
      ExtractActionValidator<T, A, 'params'>,
      ExtractActionValidator<T, A, 'query'>,
      ExtractActionValidator<T, A, 'body'>,
      ExtractActionHandler<T, A>
    >
  >;
};
