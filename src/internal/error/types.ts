import type { RecordString, RecordUnknown } from '../../types/helper';

export interface IgnisiaErrorOption {
  errors: RecordUnknown | RecordString | unknown | null;
  // TODO: Change this to StatusCode
  status: number;
  message: string;
  name?: string | null;
}
