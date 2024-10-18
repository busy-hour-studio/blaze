import './types/validator';

export type {
  Action,
  ActionCallResult,
  ActionHandler,
  ActionOpenAPI,
  ActionValidator,
  Actions,
  AnyAction,
  AnyValidator,
  OpenAPIBody,
} from './types/action';
export type {
  ActionCallRecord,
  ActionEventCallRequest,
  EventCallRecord,
  TrpcMutationCallRecord,
  TrpcQueryCallRecord,
} from './types/common';
export type { AnyEvent, Event, Events } from './types/event';
export type {
  AcceptedAfterHook,
  AcceptedBeforeHook,
  ActionHook,
  AfterHookHandler,
  AnyActionHook,
  AnyAfterHook,
  AnyAfterHookHandler,
  AnyBeforeHook,
  AnyBeforeHookHandler,
  BeforeHookHandler,
} from './types/hooks';
export type { Method, RestParam, RestRoute } from './types/rest';
export type { Service } from './types/service';

export { BlazeConfig } from './config';
export { BlazeCreator } from './creator';
export { BlazeError } from './errors/BlazeError';
export { ValidationError } from './errors/ValidationError';
export { Blaze, BlazeRouter, z } from './router';
export { initializeServices } from './utils/setup';
