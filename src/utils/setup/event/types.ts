import type { BlazeEvent } from '../../../types/event';

export interface BlazeServiceEventOption {
  event: BlazeEvent;
  serviceName: string;
  eventAlias: string;
}
