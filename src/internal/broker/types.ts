import type { ActionCallRecord, EventCallRecord } from '../../types/common';

export type BlazeActionCallName =
  | keyof ActionCallRecord
  | (string & NonNullable<unknown>);

export type BlazeEventCallName =
  | keyof EventCallRecord
  | (string & NonNullable<unknown>);
