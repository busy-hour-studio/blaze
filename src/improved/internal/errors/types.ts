import type { RecordUnknown } from '../../types/common.ts';
import type { StatusCode } from '../../types/rest.ts';

export interface BlazeErrorOption {
  errors: RecordUnknown | unknown | null;
  status: StatusCode;
  message: string;
  name?: string | null;
}
