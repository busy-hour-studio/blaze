/* eslint-disable import/no-cycle */
import { BlazeBroker as Broker } from './BlazeBroker';
import { BlazeEventEmitter as EventEmitter } from './BlazeEventEmitter';

export { BlazeContext } from './BlazeContext';
export { BlazeMap } from './BlazeMap';

export const BlazeBroker = new Broker();
export const BlazeEvent = new EventEmitter({});
