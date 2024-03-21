import type { RecordString, RecordUnknown } from './helper';

export interface BlazeErrorOption {
  errors: RecordUnknown | RecordString | unknown | null;
  status: number;
  message: string;
  name?: string | null;
}
