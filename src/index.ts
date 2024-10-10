import './types/validator';

export type {
  AnyBlazeAction,
  AnyBlazeActions,
  BlazeAction,
} from './types/action';
export type {
  ActionCallRecord,
  ActionEventCallRequest,
  EventCallRecord,
  TrpcMutationCallRecord,
  TrpcQueryCallRecord,
} from './types/common';
export { AnyBlazeEvent, AnyBlazeEvents, BlazeEvent } from './types/event';
export type { BlazeActionHandler, BlazeEventHandler } from './types/handler';
export {
  AnyBlazeActionHook,
  AnyBlazeAfterHookHandler,
  AnyBlazeBeforeHookHandler,
  BlazeAcceptedAfterHook,
  BlazeAcceptedBeforeHook,
  BlazeActionHook,
  BlazeAfterHookHandler,
  BlazeBeforeHookHandler,
} from './types/hook';
export { BlazeActionOpenAPI, OpenAPIBody } from './types/openapi';
export type {
  BlazeRestParam,
  BlazeRestRoute,
  ExposedBlazeRestMethod,
} from './types/rest';
export type { BlazeService } from './types/service';
export {
  AnyBlazeActionValidator,
  BlazeActionValidator,
} from './types/validator';

export { BlazeConfig } from './config';
export { BlazeCreator } from './creator';
export { BlazeError } from './internal/error';
export { Blaze, BlazeRouter, z } from './router';
export { initializeServices } from './utils/setup';
