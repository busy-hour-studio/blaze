/* eslint-disable import/no-cycle */
import { BlazeBroker as Broker } from './broker/index.ts';
import { BlazeEventEmitter as EventEmitter } from './event-emitter/index.ts';
import { BlazeConfig as Config } from './config/index.ts';

export { BlazeContext } from './context/index.ts';
export { BlazeMap } from './map/index.ts';

export const BlazeBroker = new Broker();
export const BlazeEvent = new EventEmitter({});
export const BlazeConfig = new Config();
