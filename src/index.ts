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
export type { AnyEvent, Event, Events } from './types/event';
export type {
  ActionCallRecord,
  ActionEventCallRequest,
  EventCallRecord,
  TrpcMutationCallRecord,
  TrpcQueryCallRecord,
} from './types/external';
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
} from './types/hooks/index';
export type { Method, RestParam, RestRoute } from './types/rest';
export type { Service } from './types/service';

export { BlazeCreator } from './creator/index';
export { BlazeConfig } from './internal/config/instance';
export { BlazeError } from './internal/errors/index';
export { BlazeValidationError } from './internal/errors/validation';
export { initializeServices } from './loader/index';
export { Blaze, BlazeRouter, z } from './router/index';
