import type {
  BlazeActionCreator,
  BlazeEventCreator,
  BlazeServiceCreator,
} from '../types/creator/index.ts';
import { createAction, createActionValidator } from './action.ts';
import { createEvent, createEventValidator } from './event.ts';
import { createAfterHook, createBeforeHook } from './hooks.ts';
import { createActionOpenAPI } from './openapi.ts';
import { createService } from './service.ts';

const ActionCreator = createAction as BlazeActionCreator;
ActionCreator.validator = createActionValidator;
ActionCreator.openapi = createActionOpenAPI;
ActionCreator.hook = {
  after: createAfterHook,
  before: createBeforeHook,
};

const EventCreator = createEvent as BlazeEventCreator;
EventCreator.validator = createEventValidator;

const ServiceCreator = createService as BlazeServiceCreator;
ServiceCreator.action = ActionCreator;
ServiceCreator.event = EventCreator;

/**
 * Create Blaze service, action, event, etc.
 */
export const BlazeCreator = {
  service: ServiceCreator,
  action: ActionCreator,
  event: EventCreator,
};
