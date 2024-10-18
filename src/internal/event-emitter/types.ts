import type { Random } from '../../types/common';

export interface EmitterListener {
  (...args: Random[]): Promise<Random> | Random;
}

export interface BlazeEventEmitterOption {
  maxListener?: number | null;
  useMap?: boolean;
}
