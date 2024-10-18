import type { Random } from '../../types/common.ts';

export interface EmitterListener {
  (...args: Random[]): Promise<Random> | Random;
}

export interface BlazeEventEmitterOption {
  maxListener?: number | null;
  useMap?: boolean;
}
