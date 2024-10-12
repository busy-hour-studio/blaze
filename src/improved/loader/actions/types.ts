import type { BlazeAction } from '../../types/action.ts';

export interface BlazeActionServiceOption {
  action: BlazeAction;
  serviceName: string;
  actionAlias: string;
}
