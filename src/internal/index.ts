/* eslint-disable import/no-cycle */
import { BlazeBroker as Broker } from './broker';
import { BlazeEventEmitter as EventEmitter } from './event-emitter';

export { BlazeContext } from './context';
export { BlazeMap } from './map';

export const BlazeBroker = new Broker();
export const BlazeEventEmitter = new EventEmitter({});
