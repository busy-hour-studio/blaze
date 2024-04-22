import type {
  BlazeActionCreator,
  BlazeEventCreator,
  BlazeServiceCreator,
} from '../types/creator';
import { createAction, createActionValidator } from './action';
import { createEvent, createEventValidator } from './event';
import { createAfterHook, createBeforeHook } from './hooks';
import { createActionOpenAPI } from './openapi';
import { createService } from './service';

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
 * @deprecated use "satifies Service, Action, Event, etc." instead to support type safe code with "@busy-hour/blaze-type"
 */
export const BlazeCreator = {
  service: ServiceCreator,
  action: ActionCreator,
  event: EventCreator,
};
