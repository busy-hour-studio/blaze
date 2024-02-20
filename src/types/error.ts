import type { RecordUnknown } from './helper';

export type BlazeErrorOption =
  | string
  | {
      errors: RecordUnknown | unknown | null;
      status: number;
      message: string;
    };
