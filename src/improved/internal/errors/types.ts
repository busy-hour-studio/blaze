import type { RecordUnknown } from '../../types/common.ts';

export interface BlazeErrorOption {
  errors: RecordUnknown | unknown | null;
  status: number;
  message: string;
  name?: string | null;
}
