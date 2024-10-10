import type { BlazeAction } from '../../../types/action';

export interface BlazeServiceActionOption {
  action: BlazeAction;
  serviceName: string;
  actionAlias: string;
}
