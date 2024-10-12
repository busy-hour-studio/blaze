import type { Random } from '../../types/common.ts';

export interface BlazeEventListener {
  (...values: Random[]): Promise<void | unknown> | void | unknown;
}

export interface BlazeEventEmitterOption {
  maxListener?: number;
}
