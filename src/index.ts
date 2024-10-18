import './types/validator.ts';

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
} from './types/action.ts';
export type { AnyEvent, Event, Events } from './types/event.ts';
export type {
  ActionCallRecord,
  ActionEventCallRequest,
  EventCallRecord,
  TrpcMutationCallRecord,
  TrpcQueryCallRecord,
} from './types/external.ts';
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
} from './types/hooks/index.ts';
export type { Method, RestParam, RestRoute } from './types/rest.ts';
export type { Service } from './types/service.ts';

export { BlazeCreator } from './creator/index.ts';
export { BlazeConfig } from './internal/config/instance.ts';
export { BlazeError } from './internal/errors/index.ts';
export { BlazeValidationError } from './internal/errors/validation.ts';
export { initializeServices } from './loader/index.ts';
export { Blaze, BlazeRouter, z } from './router/index.ts';
