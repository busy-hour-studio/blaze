import type { BlazeEvent } from '../../types/event.ts';

export interface BlazeServiceEventOption {
  event: BlazeEvent;
  serviceName: string;
  eventAlias: string;
}
