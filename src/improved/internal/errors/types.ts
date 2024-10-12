import type { RecordUnknown } from '../../types/common';

export interface BlazeErrorOption {
  errors: RecordUnknown | unknown | null;
  status: number;
  message: string;
  name?: string | null;
}
