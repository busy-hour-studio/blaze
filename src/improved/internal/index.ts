/* eslint-disable import/no-cycle */
import { BlazeBroker as Broker } from './broker/index.ts';
import { BlazeEventEmitter as EventEmitter } from './event-emitter/index.ts';

export const BlazeBroker = new Broker();
export const BlazeEvent = new EventEmitter({});
