import type { RecordString, RecordUnknown } from './helper';

export type BlazeErrorOption =
  | string
  | {
      errors: RecordUnknown | RecordString | unknown | null;
      status: number;
      message: string;
      name?: string | null;
    };
