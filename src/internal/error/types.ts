import type { RecordUnknown } from '../../types/common';
import type { StatusCode } from '../../types/rest';

export interface BlazeErrorOption {
  errors: RecordUnknown | unknown | null;
  status: StatusCode;
  message: string;
  name?: string | null;
}
