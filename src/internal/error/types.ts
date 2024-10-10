import { StatusCode } from '../../types.new/rest';
import type { RecordString, RecordUnknown } from '../../types/helper';

export interface BlazeErrorOption {
  errors: RecordUnknown | RecordString | unknown | null;
  status: StatusCode;
  message: string;
  name?: string | null;
}
